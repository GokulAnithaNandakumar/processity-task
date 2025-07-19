// Utility functions for testing and app functionality

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Validate task priority
 * @param {string} priority - Priority to validate
 * @returns {boolean} True if valid priority
 */
const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
};

/**
 * Validate task status
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid status
 */
const validateStatus = (status) => {
  const validStatuses = ['pending', 'in-progress', 'completed'];
  return validStatuses.includes(status);
};

/**
 * Check if task is overdue
 * @param {Object} task - Task object
 * @returns {boolean} True if task is overdue
 */
const isTaskOverdue = (task) => {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date() && task.status !== 'completed';
};

/**
 * Calculate completion rate from tasks array
 * @param {Array} tasks - Array of tasks
 * @returns {number} Completion percentage
 */
const calculateCompletionRate = (tasks) => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Generate unique task ID for testing
 * @returns {string} Unique ID
 */
const generateTaskId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Create mock task for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock task object
 */
const createMockTask = (overrides = {}) => {
  return {
    _id: generateTaskId(),
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'medium',
    user: 'test-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

/**
 * Create mock user for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock user object
 */
const createMockUser = (overrides = {}) => {
  return {
    _id: generateTaskId(),
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    ...overrides
  };
};

/**
 * Sanitize task data for API requests
 * @param {Object} task - Task object
 * @returns {Object} Sanitized task
 */
const sanitizeTaskData = (task) => {
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
  const sanitized = {};

  allowedFields.forEach(field => {
    if (task[field] !== undefined) {
      sanitized[field] = task[field];
    }
  });

  return sanitized;
};

module.exports = {
  formatDate,
  validatePriority,
  validateStatus,
  isTaskOverdue,
  calculateCompletionRate,
  generateTaskId,
  createMockTask,
  createMockUser,
  sanitizeTaskData
};
