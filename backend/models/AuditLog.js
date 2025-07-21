const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Authentication actions
      'USER_LOGIN',
      'USER_LOGOUT',
      'USER_REGISTER',
      'USER_PASSWORD_CHANGE',
      'USER_PROFILE_UPDATE',

      // Task actions
      'TASK_CREATE',
      'TASK_UPDATE',
      'TASK_DELETE',
      'TASK_VIEW',
      'TASK_STATUS_CHANGE',

      // Data actions
      'DATA_EXPORT',
      'DATA_DELETE_REQUEST',
      'ACCOUNT_DELETE',

      // Security actions
      'UNAUTHORIZED_ACCESS_ATTEMPT',
      'RATE_LIMIT_EXCEEDED',
      'INVALID_TOKEN',

      // Administrative actions
      'ADMIN_ACTION',
      'SYSTEM_ERROR'
    ],
    index: true
  },
  resource: {
    type: String,
    required: true,
    index: true // e.g., 'user', 'task', 'system'
  },
  resourceId: {
    type: String,
    index: true // ID of the affected resource
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true,
    index: true
  },
  statusCode: {
    type: Number,
    required: true,
    index: true
  },
  responseTime: {
    type: Number, // in milliseconds
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    index: true
  },
  errorMessage: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW',
    index: true
  },
  category: {
    type: String,
    enum: ['AUTHENTICATION', 'AUTHORIZATION', 'DATA_ACCESS', 'DATA_MODIFICATION', 'SECURITY', 'SYSTEM'],
    required: true,
    index: true
  }
});

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, timestamp: -1 });
auditLogSchema.index({ success: 1, timestamp: -1 });

// TTL index to automatically delete logs after 7 years (for compliance)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 365 * 24 * 60 * 60 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
