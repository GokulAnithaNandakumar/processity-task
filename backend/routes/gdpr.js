const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');
const AuditLog = require('../models/AuditLog');
const AuditLogger = require('../utils/auditLogger');

const router = express.Router();

// @route   GET /api/gdpr/export
// @desc    Export all user data (GDPR Article 15 - Right of access)
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const tasks = await Task.find({ userId: req.user._id });
    const auditLogs = await AuditLog.find({ userId: req.user._id })
      .select('-_id -__v')
      .sort({ timestamp: -1 })
      .limit(1000); // Limit to last 1000 audit entries

    const exportData = {
      exportMetadata: {
        userId: req.user._id,
        exportDate: new Date().toISOString(),
        dataRetentionPolicy: '7 years for audit logs, indefinite for user data unless deletion requested',
        legalBasis: 'GDPR Article 15 - Right of access',
        exportVersion: '1.0'
      },
      personalData: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        tasks: tasks.map(task => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        })),
        auditTrail: auditLogs.map(log => ({
          action: log.action,
          timestamp: log.timestamp,
          ipAddress: log.ipAddress,
          details: log.details,
          success: log.success
        }))
      },
      summary: {
        totalTasks: tasks.length,
        totalAuditEntries: auditLogs.length,
        accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) + ' days'
      }
    };

    // Log the data export
    await AuditLogger.logDataAccess(
      req.user,
      'DATA_EXPORT',
      req,
      true,
      null,
      { exportSize: JSON.stringify(exportData).length }
    );

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="user-data-export-${req.user._id}-${Date.now()}.json"`
    });

    res.status(200).json({
      status: 'success',
      data: exportData
    });

  } catch (error) {
    console.error('Data export error:', error);

    await AuditLogger.logDataAccess(
      req.user,
      'DATA_EXPORT',
      req,
      false,
      error.message
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to export user data'
    });
  }
});

// @route   POST /api/gdpr/delete-request
// @desc    Request account deletion (GDPR Article 17 - Right to erasure)
// @access  Private
router.post('/delete-request', [
  protect,
  body('confirmEmail').isEmail().withMessage('Please provide your email for confirmation'),
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  body('confirmPassword').isLength({ min: 6 }).withMessage('Please provide your password for confirmation')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { confirmEmail, reason, confirmPassword } = req.body;

    // Verify email matches
    if (confirmEmail !== req.user.email) {
      await AuditLogger.logSecurityEvent(
        req.user,
        'INVALID_DELETE_REQUEST',
        req,
        'MEDIUM',
        'Email confirmation mismatch'
      );

      return res.status(400).json({
        status: 'error',
        message: 'Email confirmation does not match your account email'
      });
    }

    // Verify password
    const user = await User.findById(req.user._id);
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(confirmPassword, user.password);

    if (!isMatch) {
      await AuditLogger.logSecurityEvent(
        req.user,
        'INVALID_DELETE_REQUEST',
        req,
        'HIGH',
        'Password confirmation failed'
      );

      return res.status(400).json({
        status: 'error',
        message: 'Invalid password confirmation'
      });
    }

    // Mark user for deletion (soft delete approach for compliance)
    await User.findByIdAndUpdate(req.user._id, {
      deletionRequested: true,
      deletionRequestDate: new Date(),
      deletionReason: reason || 'User requested account deletion',
      status: 'pending_deletion'
    });

    // Log the deletion request
    await AuditLogger.logDataAccess(
      req.user,
      'DATA_DELETE_REQUEST',
      req,
      true,
      null,
      { reason: reason || 'User requested account deletion' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Account deletion request submitted successfully',
      data: {
        requestDate: new Date().toISOString(),
        processing: {
          timeframe: '30 days',
          description: 'Your account will be permanently deleted within 30 days as per GDPR requirements',
          withdrawalPeriod: '30 days to withdraw the request'
        },
        nextSteps: [
          'You will receive an email confirmation',
          'Your account will be deactivated immediately',
          'All data will be permanently deleted after 30 days',
          'You can withdraw this request within 30 days by contacting support'
        ]
      }
    });

  } catch (error) {
    console.error('Deletion request error:', error);

    await AuditLogger.logDataAccess(
      req.user,
      'DATA_DELETE_REQUEST',
      req,
      false,
      error.message
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to process deletion request'
    });
  }
});

// @route   POST /api/gdpr/withdraw-deletion
// @desc    Withdraw account deletion request
// @access  Private
router.post('/withdraw-deletion', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.deletionRequested) {
      return res.status(400).json({
        status: 'error',
        message: 'No deletion request found for this account'
      });
    }

    // Check if within withdrawal period (30 days)
    const requestDate = new Date(user.deletionRequestDate);
    const withdrawalDeadline = new Date(requestDate.getTime() + (30 * 24 * 60 * 60 * 1000));

    if (Date.now() > withdrawalDeadline) {
      return res.status(400).json({
        status: 'error',
        message: 'Withdrawal period has expired. Please contact support for assistance.'
      });
    }

    // Withdraw deletion request
    await User.findByIdAndUpdate(req.user._id, {
      deletionRequested: false,
      deletionRequestDate: null,
      deletionReason: null,
      status: 'active'
    });

    await AuditLogger.logDataAccess(
      req.user,
      'DATA_DELETE_WITHDRAWAL',
      req,
      true,
      null,
      { withdrawalDate: new Date().toISOString() }
    );

    res.status(200).json({
      status: 'success',
      message: 'Account deletion request withdrawn successfully',
      data: {
        withdrawalDate: new Date().toISOString(),
        accountStatus: 'active'
      }
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to withdraw deletion request'
    });
  }
});

// @route   GET /api/gdpr/data-summary
// @desc    Get summary of user data (GDPR transparency)
// @access  Private
router.get('/data-summary', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const taskCount = await Task.countDocuments({ userId: req.user._id });
    const auditLogCount = await AuditLog.countDocuments({ userId: req.user._id });

    const lastLogin = await AuditLog.findOne({
      userId: req.user._id,
      action: 'USER_LOGIN',
      success: true
    }).sort({ timestamp: -1 });

    const dataSummary = {
      profile: {
        name: user.name,
        email: user.email,
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
        accountStatus: user.status || 'active'
      },
      dataStats: {
        totalTasks: taskCount,
        totalAuditEntries: auditLogCount,
        lastLogin: lastLogin ? lastLogin.timestamp : null
      },
      dataRetention: {
        userProfile: 'Retained until account deletion',
        tasks: 'Retained until account deletion',
        auditLogs: '7 years from creation date',
        sessions: '24 hours'
      },
      yourRights: {
        access: 'Request a copy of your data',
        rectification: 'Request correction of inaccurate data',
        erasure: 'Request deletion of your account and data',
        portability: 'Export your data in a structured format',
        objection: 'Object to processing of your data',
        restriction: 'Request restriction of processing'
      },
      dataProcessing: {
        purpose: 'Task management and user authentication',
        legalBasis: 'Consent and legitimate interest',
        sharing: 'Data is not shared with third parties',
        location: 'Data stored in Azure cloud infrastructure'
      }
    };

    res.status(200).json({
      status: 'success',
      data: dataSummary
    });

  } catch (error) {
    console.error('Data summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve data summary'
    });
  }
});

module.exports = router;
