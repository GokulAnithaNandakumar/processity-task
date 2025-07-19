const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

// Test database configuration
const connectTestDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb+srv://gokul:Qpg6FepNh2Ln4g7P@taskmanager.fq3tj.mongodb.net/taskmanager_test?retryWrites=true&w=majority';

    const options = {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      maxIdleTimeMS: 30000,
      bufferCommands: false
    };

    await mongoose.connect(mongoUri, options);
    console.log('✅ Connected to test database');

  } catch (error) {
    console.error('❌ Error connecting to test database:', error);
    throw error;
  }
};const disconnectTestDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('✅ Disconnected from test database');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from test database:', error);
  }
};

// Clean up test data after each test
const cleanupTestDB = async () => {
  try {
    // Only clean up if we're in test environment
    if (process.env.NODE_ENV === 'test') {
      await User.deleteMany({});
      await Task.deleteMany({});
      console.log('Test database cleaned up');
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
};

// Create test user helper
const createTestUser = async (userData = {}) => {
  const defaultData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  return await User.create({ ...defaultData, ...userData });
};

// Create test task helper
const createTestTask = async (userId, taskData = {}) => {
  const defaultData = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'medium'
  };

  return await Task.create({
    ...defaultData,
    ...taskData,
    userId
  });
};

// Generate mock task data
const generateMockTasks = (count = 5, userId = null) => {
  const tasks = [];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'in-progress', 'completed'];

  for (let i = 0; i < count; i++) {
    tasks.push({
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      userId: userId || new mongoose.Types.ObjectId(),
      dueDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)) // i days from now
    });
  }

  return tasks;
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  cleanupTestDB,
  createTestUser,
  createTestTask,
  generateMockTasks
};
