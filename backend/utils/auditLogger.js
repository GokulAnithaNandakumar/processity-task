const AuditLog = require('../models/AuditLog');

class AuditLogger {
  static async log(auditData) {
    try {
      const auditLog = new AuditLog({
        userId: auditData.userId,
        userEmail: auditData.userEmail,
        action: auditData.action,
        resource: auditData.resource,
        resourceId: auditData.resourceId,
        details: auditData.details || {},
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        method: auditData.method,
        endpoint: auditData.endpoint,
        statusCode: auditData.statusCode,
        responseTime: auditData.responseTime,
        success: auditData.success,
        errorMessage: auditData.errorMessage,
        sessionId: auditData.sessionId,
        severity: auditData.severity || 'LOW',
        category: auditData.category
      });

      await auditLog.save();

      // Log critical events to console for immediate attention
      if (auditData.severity === 'CRITICAL' || auditData.severity === 'HIGH') {
        console.warn(`[AUDIT ${auditData.severity}] ${auditData.action} by ${auditData.userEmail} at ${new Date().toISOString()}`);
      }

      return auditLog;
    } catch (error) {
      console.error('Failed to save audit log:', error);
      // Don't throw error to avoid breaking the main application flow
    }
  }

  // Helper methods for common audit actions
  static async logAuthentication(user, action, req, success = true, errorMessage = null) {
    const severity = success ? 'LOW' : 'HIGH';
    return this.log({
      userId: user?._id,
      userEmail: user?.email,
      action,
      resource: 'user',
      resourceId: user?._id,
      details: { success },
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || 'Unknown',
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: success ? 200 : 401,
      responseTime: req.responseTime || 0,
      success,
      errorMessage,
      sessionId: req.sessionID,
      severity,
      category: 'AUTHENTICATION'
    });
  }

  static async logTaskAction(user, action, taskId, req, success = true, errorMessage = null, details = {}) {
    return this.log({
      userId: user._id,
      userEmail: user.email,
      action,
      resource: 'task',
      resourceId: taskId,
      details,
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || 'Unknown',
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: success ? 200 : 400,
      responseTime: req.responseTime || 0,
      success,
      errorMessage,
      sessionId: req.sessionID,
      severity: 'LOW',
      category: 'DATA_MODIFICATION'
    });
  }

  static async logDataAccess(user, action, req, success = true, errorMessage = null, details = {}) {
    return this.log({
      userId: user._id,
      userEmail: user.email,
      action,
      resource: 'data',
      resourceId: null,
      details,
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || 'Unknown',
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: success ? 200 : 400,
      responseTime: req.responseTime || 0,
      success,
      errorMessage,
      sessionId: req.sessionID,
      severity: action.includes('DELETE') ? 'HIGH' : 'MEDIUM',
      category: 'DATA_ACCESS'
    });
  }

  static async logSecurityEvent(user, action, req, severity = 'HIGH', errorMessage = null, details = {}) {
    return this.log({
      userId: user?._id,
      userEmail: user?.email || 'Anonymous',
      action,
      resource: 'security',
      resourceId: null,
      details,
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || 'Unknown',
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: 403,
      responseTime: req.responseTime || 0,
      success: false,
      errorMessage,
      sessionId: req.sessionID,
      severity,
      category: 'SECURITY'
    });
  }

  static getClientIP(req) {
    return req.ip ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           'Unknown';
  }

  // Query methods for audit reports
  static async getUserAuditLogs(userId, limit = 100, skip = 0) {
    return AuditLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  }

  static async getSecurityEvents(timeframe = 24) { // hours
    const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);
    return AuditLog.find({
      category: 'SECURITY',
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 }).lean();
  }

  static async getFailedLoginAttempts(timeframe = 1) { // hours
    const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);
    return AuditLog.find({
      action: 'USER_LOGIN',
      success: false,
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 }).lean();
  }

  static async getCriticalEvents(timeframe = 24) { // hours
    const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);
    return AuditLog.find({
      severity: { $in: ['HIGH', 'CRITICAL'] },
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 }).lean();
  }
}

module.exports = AuditLogger;
