const express = require('express');
const { protect } = require('../middleware/auth');
const AuditLogger = require('../utils/auditLogger');

const router = express.Router();

// Simple monitoring without timers to avoid ESLint issues
const monitoringData = {
  metrics: {
    requests: 0,
    errors: 0,
    responseTimeSum: 0,
    averageResponseTime: 0
  },
  alerts: [],
  systemHealth: {
    lastCheck: null,
    status: 'healthy'
  }
};

// @route   GET /api/monitoring/health
// @desc    Get system health status
// @access  Private (Admin only in production)
router.get('/health', protect, async (req, res) => {
  try {
    const mongoose = require('mongoose');

    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          readyState: mongoose.connection.readyState
        },
        memory: {
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
          external: Math.round(process.memoryUsage().external / 1024 / 1024) + 'MB'
        },
        uptime: {
          process: Math.floor(process.uptime()) + ' seconds',
          system: Math.floor(require('os').uptime()) + ' seconds'
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch
        }
      }
    };

    // Determine overall health status
    if (mongoose.connection.readyState !== 1) {
      health.status = 'unhealthy';
      health.issues = ['Database connection failed'];
    }

    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    if (memoryUsage > 500) {
      health.status = health.status === 'healthy' ? 'warning' : 'unhealthy';
      health.issues = health.issues || [];
      health.issues.push('High memory usage: ' + Math.round(memoryUsage) + 'MB');
    }

    res.status(health.status === 'healthy' ? 200 : 503).json({
      status: 'success',
      data: health
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// @route   GET /api/monitoring/metrics
// @desc    Get application metrics
// @access  Private (Admin only in production)
router.get('/metrics', protect, async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      application: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        version: process.env.npm_package_version || '1.0.0'
      },
      requests: monitoringData.metrics,
      security: {
        recentFailedLogins: (await AuditLogger.getFailedLoginAttempts(1)).length,
        recentSecurityEvents: (await AuditLogger.getSecurityEvents(1)).length,
        criticalEvents: (await AuditLogger.getCriticalEvents(24)).length
      }
    };

    res.status(200).json({
      status: 'success',
      data: metrics
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve metrics',
      error: error.message
    });
  }
});

// @route   GET /api/monitoring/security-events
// @desc    Get recent security events
// @access  Private (Admin only in production)
router.get('/security-events', protect, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const limit = parseInt(req.query.limit) || 50;

    const securityEvents = await AuditLogger.getSecurityEvents(hours);
    const failedLogins = await AuditLogger.getFailedLoginAttempts(hours);
    const criticalEvents = await AuditLogger.getCriticalEvents(hours);

    const summary = {
      timeframe: hours + ' hours',
      total: {
        securityEvents: securityEvents.length,
        failedLogins: failedLogins.length,
        criticalEvents: criticalEvents.length
      },
      events: {
        security: securityEvents.slice(0, limit),
        failedLogins: failedLogins.slice(0, limit),
        critical: criticalEvents.slice(0, limit)
      },
      analysis: {
        uniqueFailedLoginIPs: [...new Set(failedLogins.map(log => log.ipAddress))].length,
        mostCommonFailureReasons: getFailureReasons(failedLogins),
        alertLevel: determineAlertLevel(securityEvents.length, failedLogins.length, criticalEvents.length)
      }
    };

    res.status(200).json({
      status: 'success',
      data: summary
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve security events',
      error: error.message
    });
  }
});

// @route   POST /api/monitoring/alert
// @desc    Create a manual alert
// @access  Private (Admin only in production)
router.post('/alert', protect, async (req, res) => {
  try {
    const { severity, type, message, details } = req.body;

    if (!severity || !type || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Severity, type, and message are required'
      });
    }

    const alert = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      severity: severity.toUpperCase(),
      type: type.toUpperCase(),
      message,
      details: details || {},
      createdBy: req.user.email,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    monitoringData.alerts.push(alert);

    // Log to audit trail
    await AuditLogger.logDataAccess(
      req.user,
      'MANUAL_ALERT_CREATED',
      req,
      true,
      null,
      { alertId: alert.id, severity, type }
    );

    console.warn(`[MANUAL ALERT ${severity}] ${type}: ${message}`, details);

    res.status(201).json({
      status: 'success',
      data: alert
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create alert',
      error: error.message
    });
  }
});

// Helper functions
function getFailureReasons(failedLogins) {
  const reasons = {};
  failedLogins.forEach(log => {
    const reason = log.errorMessage || 'Unknown';
    reasons[reason] = (reasons[reason] || 0) + 1;
  });
  return Object.entries(reasons)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([reason, count]) => ({ reason, count }));
}

function determineAlertLevel(securityEvents, failedLogins, criticalEvents) {
  if (criticalEvents > 5 || securityEvents > 20 || failedLogins > 50) {
    return 'CRITICAL';
  } else if (criticalEvents > 2 || securityEvents > 10 || failedLogins > 20) {
    return 'HIGH';
  } else if (securityEvents > 5 || failedLogins > 10) {
    return 'MEDIUM';
  }
  return 'LOW';
}

// Middleware to track requests
const trackRequest = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const success = res.statusCode < 400;

    monitoringData.metrics.requests++;
    if (!success) {
      monitoringData.metrics.errors++;
    }
    monitoringData.metrics.responseTimeSum += responseTime;
    monitoringData.metrics.averageResponseTime =
      monitoringData.metrics.responseTimeSum / monitoringData.metrics.requests;
  });

  next();
};

router.trackRequest = trackRequest;

module.exports = router;
