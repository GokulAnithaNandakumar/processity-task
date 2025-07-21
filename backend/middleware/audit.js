const AuditLogger = require('../utils/auditLogger');

// Middleware to track response time
const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    req.responseTime = Date.now() - start;
    originalEnd.apply(this, args);
  };

  next();
};

// Middleware to log all API requests
const auditMiddleware = (req, res, next) => {
  // Skip audit logging for health checks and static assets
  if (req.path === '/api/health' || req.path.includes('static')) {
    return next();
  }

  const start = Date.now();

  // Capture original res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    req.responseTime = Date.now() - start;

    // Log the request after response is sent
    process.nextTick(async () => {
      try {
        const user = req.user || null;
        const success = res.statusCode < 400;

        // Determine action based on method and endpoint
        const action = determineAction(req.method, req.path, success);

        if (action) {
          await AuditLogger.log({
            userId: user?._id,
            userEmail: user?.email || 'Anonymous',
            action,
            resource: determineResource(req.path),
            resourceId: extractResourceId(req.path, req.params),
            details: {
              params: req.params,
              query: req.query,
              body: sanitizeBody(req.body)
            },
            ipAddress: AuditLogger.getClientIP(req),
            userAgent: req.get('User-Agent') || 'Unknown',
            method: req.method,
            endpoint: req.originalUrl,
            statusCode: res.statusCode,
            responseTime: req.responseTime,
            success,
            errorMessage: success ? null : data?.message,
            sessionId: req.sessionID,
            severity: determineSeverity(req.method, req.path, success),
            category: determineCategory(req.path)
          });
        }
      } catch (error) {
        console.error('Audit logging failed:', error);
      }
    });

    return originalJson.call(this, data);
  };

  next();
};

function determineAction(method, path, success) {
  if (!success && path.includes('/auth/')) {
    return 'UNAUTHORIZED_ACCESS_ATTEMPT';
  }

  if (path.includes('/auth/login')) {
    return success ? 'USER_LOGIN' : 'USER_LOGIN';
  }

  if (path.includes('/auth/register')) {
    return 'USER_REGISTER';
  }

  if (path.includes('/auth/me')) {
    return 'USER_PROFILE_UPDATE';
  }

  if (path.includes('/gdpr/export')) {
    return 'DATA_EXPORT';
  }

  if (path.includes('/gdpr/delete')) {
    return 'DATA_DELETE_REQUEST';
  }

  if (path.includes('/tasks')) {
    switch (method) {
    case 'GET':
      return path.includes('/tasks/') ? 'TASK_VIEW' : 'TASK_VIEW';
    case 'POST':
      return 'TASK_CREATE';
    case 'PUT':
    case 'PATCH':
      return 'TASK_UPDATE';
    case 'DELETE':
      return 'TASK_DELETE';
    default:
      return null;
    }
  }

  return null;
}

function determineResource(path) {
  if (path.includes('/auth/')) return 'user';
  if (path.includes('/tasks')) return 'task';
  if (path.includes('/gdpr/')) return 'data';
  return 'system';
}

function extractResourceId(path, params) {
  if (params?.id) return params.id;
  if (params?.taskId) return params.taskId;

  // Extract ID from path like /api/tasks/123
  const matches = path.match(/\/([a-f\d]{24})$/);
  return matches ? matches[1] : null;
}

function sanitizeBody(body) {
  if (!body) return {};

  const sanitized = { ...body };

  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.authorization;

  return sanitized;
}

function determineSeverity(method, path, success) {
  if (!success) {
    if (path.includes('/auth/')) return 'HIGH';
    if (method === 'DELETE') return 'MEDIUM';
    return 'MEDIUM';
  }

  if (path.includes('/gdpr/delete')) return 'HIGH';
  if (method === 'DELETE') return 'MEDIUM';
  if (path.includes('/auth/')) return 'LOW';

  return 'LOW';
}

function determineCategory(path) {
  if (path.includes('/auth/')) return 'AUTHENTICATION';
  if (path.includes('/gdpr/')) return 'DATA_ACCESS';
  if (path.includes('/tasks')) return 'DATA_MODIFICATION';
  return 'SYSTEM';
}

module.exports = {
  responseTimeMiddleware,
  auditMiddleware
};
