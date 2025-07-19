const mongoose = require('mongoose');

// Import utility functions from the actual utils file
const {
  formatDate,
  validatePriority,
  validateStatus,
  isTaskOverdue,
  calculateCompletionRate
} = require('../utils/testHelpers');

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const testDate = '2024-01-15T10:30:00.000Z';
      const formatted = formatDate(testDate);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    it('should handle invalid date', () => {
      const invalidDate = 'invalid-date';
      const formatted = formatDate(invalidDate);
      expect(formatted).toBe('Invalid Date');
    });
  });

  describe('validatePriority', () => {
    it('should return true for valid priorities', () => {
      expect(validatePriority('low')).toBe(true);
      expect(validatePriority('medium')).toBe(true);
      expect(validatePriority('high')).toBe(true);
    });

    it('should return false for invalid priorities', () => {
      expect(validatePriority('urgent')).toBe(false);
      expect(validatePriority('normal')).toBe(false);
      expect(validatePriority('')).toBe(false);
      expect(validatePriority(null)).toBe(false);
    });
  });

  describe('validateStatus', () => {
    it('should return true for valid statuses', () => {
      expect(validateStatus('pending')).toBe(true);
      expect(validateStatus('in-progress')).toBe(true);
      expect(validateStatus('completed')).toBe(true);
    });

    it('should return false for invalid statuses', () => {
      expect(validateStatus('done')).toBe(false);
      expect(validateStatus('started')).toBe(false);
      expect(validateStatus('')).toBe(false);
      expect(validateStatus(null)).toBe(false);
    });
  });

  describe('isTaskOverdue', () => {
    it('should return true for overdue pending tasks', () => {
      const overdueTask = {
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: 'pending'
      };
      expect(isTaskOverdue(overdueTask)).toBe(true);
    });

    it('should return false for completed tasks even if past due date', () => {
      const completedTask = {
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: 'completed'
      };
      expect(isTaskOverdue(completedTask)).toBe(false);
    });

    it('should return false for tasks without due date', () => {
      const taskWithoutDueDate = {
        status: 'pending'
      };
      expect(isTaskOverdue(taskWithoutDueDate)).toBe(false);
    });

    it('should return false for future due dates', () => {
      const futureTask = {
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'pending'
      };
      expect(isTaskOverdue(futureTask)).toBe(false);
    });
  });

  describe('calculateCompletionRate', () => {
    it('should calculate completion rate correctly', () => {
      const tasks = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'pending' },
        { status: 'in-progress' }
      ];
      expect(calculateCompletionRate(tasks)).toBe(50);
    });

    it('should return 0 for empty task array', () => {
      expect(calculateCompletionRate([])).toBe(0);
    });

    it('should return 100 for all completed tasks', () => {
      const tasks = [
        { status: 'completed' },
        { status: 'completed' }
      ];
      expect(calculateCompletionRate(tasks)).toBe(100);
    });

    it('should return 0 for no completed tasks', () => {
      const tasks = [
        { status: 'pending' },
        { status: 'in-progress' }
      ];
      expect(calculateCompletionRate(tasks)).toBe(0);
    });
  });
});
