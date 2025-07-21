const AuditLogger = require('../utils/auditLogger');
const { URL } = require('url');

class MonitoringService {
  constructor() {
    this.alerts = [];
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimeSum: 0,
      averageResponseTime: 0,
      securityEvents: 0,
      failedLogins: 0
    };
    this.thresholds = {
      errorRate: 0.05, // 5% error rate threshold
      responseTime: 5000, // 5 second response time threshold
      failedLoginAttempts: 5, // 5 failed attempts in 1 hour
      securityEvents: 10 // 10 security events in 1 hour
    };

    // Start monitoring intervals
    this.startMonitoring();
  }

  startMonitoring() {
    // Check critical metrics every 5 minutes
    setInterval(() => this.checkCriticalMetrics(), 5 * 60 * 1000);

    // Check security events every minute
    setInterval(() => this.checkSecurityEvents(), 60 * 1000);

    // Reset hourly metrics every hour
    setInterval(() => this.resetHourlyMetrics(), 60 * 60 * 1000);

    // Generate daily summary every 24 hours
    setInterval(() => this.generateDailySummary(), 24 * 60 * 60 * 1000);
  }

  async checkCriticalMetrics() {
    try {
      // Check error rate
      const errorRate = this.metrics.requests > 0 ? this.metrics.errors / this.metrics.requests : 0;
      if (errorRate > this.thresholds.errorRate) {
        await this.createAlert('HIGH', 'HIGH_ERROR_RATE', {
          errorRate: (errorRate * 100).toFixed(2) + '%',
          threshold: (this.thresholds.errorRate * 100) + '%',
          totalRequests: this.metrics.requests,
          totalErrors: this.metrics.errors
        });
      }

      // Check average response time
      if (this.metrics.averageResponseTime > this.thresholds.responseTime) {
        await this.createAlert('MEDIUM', 'SLOW_RESPONSE_TIME', {
          averageResponseTime: this.metrics.averageResponseTime + 'ms',
          threshold: this.thresholds.responseTime + 'ms',
          requestCount: this.metrics.requests
        });
      }

      // Check system health
      await this.checkSystemHealth();

    } catch (error) {
      console.error('Error checking critical metrics:', error);
    }
  }

  async checkSecurityEvents() {
    try {
      // Check failed login attempts in last hour
      const failedLogins = await AuditLogger.getFailedLoginAttempts(1);
      this.metrics.failedLogins = failedLogins.length;

      if (failedLogins.length > this.thresholds.failedLoginAttempts) {
        const uniqueIPs = [...new Set(failedLogins.map(log => log.ipAddress))];
        await this.createAlert('HIGH', 'SUSPICIOUS_LOGIN_ACTIVITY', {
          failedAttempts: failedLogins.length,
          uniqueIPs: uniqueIPs.length,
          threshold: this.thresholds.failedLoginAttempts,
          timeframe: '1 hour',
          topIPs: uniqueIPs.slice(0, 5)
        });
      }

      // Check security events in last hour
      const securityEvents = await AuditLogger.getSecurityEvents(1);
      this.metrics.securityEvents = securityEvents.length;

      if (securityEvents.length > this.thresholds.securityEvents) {
        await this.createAlert('CRITICAL', 'HIGH_SECURITY_EVENTS', {
          eventCount: securityEvents.length,
          threshold: this.thresholds.securityEvents,
          timeframe: '1 hour',
          events: securityEvents.slice(0, 10).map(event => ({
            action: event.action,
            timestamp: event.timestamp,
            ipAddress: event.ipAddress
          }))
        });
      }

    } catch (error) {
      console.error('Error checking security events:', error);
    }
  }

  async checkSystemHealth() {
    try {
      const mongoose = require('mongoose');

      // Check database connection
      if (mongoose.connection.readyState !== 1) {
        await this.createAlert('CRITICAL', 'DATABASE_CONNECTION_LOST', {
          connectionState: mongoose.connection.readyState,
          timestamp: new Date().toISOString()
        });
      }

      // Check memory usage
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

      if (heapUsedMB > 500) { // Alert if using more than 500MB
        await this.createAlert('MEDIUM', 'HIGH_MEMORY_USAGE', {
          heapUsed: heapUsedMB + 'MB',
          heapTotal: heapTotalMB + 'MB',
          threshold: '500MB'
        });
      }

      // Check uptime
      const uptimeHours = Math.floor(process.uptime() / 3600);
      if (uptimeHours < 1) { // Alert if server restarted recently
        await this.createAlert('MEDIUM', 'SERVER_RESTART', {
          uptime: uptimeHours + ' hours',
          restartTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
        });
      }

    } catch (error) {
      console.error('Error checking system health:', error);
    }
  }

  async createAlert(severity, type, details) {
    const alert = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      severity,
      type,
      details,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.alerts.push(alert);

    // Log to console for immediate visibility
    console.warn(`[MONITORING ALERT ${severity}] ${type}:`, JSON.stringify(details, null, 2));

    // Send to external monitoring services in production
    if (process.env.NODE_ENV === 'production') {
      await this.sendToExternalMonitoring(alert);
    }

    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    return alert;
  }

  async sendToExternalMonitoring(alert) {
    try {
      // In production, integrate with services like:
      // - Azure Application Insights
      // - PagerDuty
      // - Slack webhooks
      // - Email notifications

      if (process.env.APPINSIGHTS_CONNECTION_STRING) {
        const appInsights = require('applicationinsights');
        appInsights.defaultClient?.trackEvent({
          name: 'MonitoringAlert',
          properties: {
            severity: alert.severity,
            type: alert.type,
            details: JSON.stringify(alert.details)
          }
        });
      }

      // Example Slack webhook (if configured)
      if (process.env.SLACK_WEBHOOK_URL && alert.severity === 'CRITICAL') {
        const https = require('https');
        const postData = JSON.stringify({
          text: `🚨 CRITICAL Alert: ${alert.type}`,
          attachments: [{
            color: 'danger',
            fields: [{
              title: 'Details',
              value: JSON.stringify(alert.details, null, 2),
              short: false
            }]
          }]
        });

        const url = new URL(process.env.SLACK_WEBHOOK_URL);
        const options = {
          hostname: url.hostname,
          port: 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = https.request(options);
        req.write(postData);
        req.end();
      }

    } catch (error) {
      console.error('Failed to send alert to external monitoring:', error);
    }
  }

  recordRequest(success, responseTime) {
    this.metrics.requests++;
    if (!success) {
      this.metrics.errors++;
    }
    this.metrics.responseTimeSum += responseTime;
    this.metrics.averageResponseTime = this.metrics.responseTimeSum / this.metrics.requests;
  }

  resetHourlyMetrics() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimeSum: 0,
      averageResponseTime: 0,
      securityEvents: 0,
      failedLogins: 0
    };
  }

  async generateDailySummary() {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const criticalEvents = await AuditLogger.getCriticalEvents(24);
      const securityEvents = await AuditLogger.getSecurityEvents(24);
      const failedLogins = await AuditLogger.getFailedLoginAttempts(24);

      const summary = {
        date: new Date().toISOString().split('T')[0],
        period: '24 hours',
        security: {
          criticalEvents: criticalEvents.length,
          securityEvents: securityEvents.length,
          failedLogins: failedLogins.length,
          uniqueFailedLoginIPs: [...new Set(failedLogins.map(log => log.ipAddress))].length
        },
        alerts: {
          total: this.alerts.filter(alert =>
            new Date(alert.timestamp) > yesterday
          ).length,
          critical: this.alerts.filter(alert =>
            alert.severity === 'CRITICAL' && new Date(alert.timestamp) > yesterday
          ).length,
          high: this.alerts.filter(alert =>
            alert.severity === 'HIGH' && new Date(alert.timestamp) > yesterday
          ).length
        },
        system: {
          uptime: Math.floor(process.uptime() / 3600) + ' hours',
          memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
        }
      };

      console.log('[DAILY MONITORING SUMMARY]', JSON.stringify(summary, null, 2));

      // Store summary for historical analysis
      return summary;

    } catch (error) {
      console.error('Error generating daily summary:', error);
    }
  }

  getAlerts(severity = null, limit = 50) {
    let alerts = this.alerts;

    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }

    return alerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getCurrentMetrics() {
    return {
      ...this.metrics,
      uptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
}

// Singleton instance
const monitoringService = new MonitoringService();

module.exports = monitoringService;
