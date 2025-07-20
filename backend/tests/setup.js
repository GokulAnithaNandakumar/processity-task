// Test setup configuration
require('dotenv').config({ path: '.env.test' });

const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB, cleanupTestDB } = require('../utils/testDatabase');

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Connect to test database (Atlas with test database name)
  await connectTestDB();

  // Suppress console logs during tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    global.console = {
      ...console,
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  }
});

// Clean up after each test - DISABLED for now to avoid conflicts
// afterEach(async () => {
//   // Clean up test data to ensure test isolation
//   await cleanupTestDB();
// });

afterAll(async () => {
  // Disconnect from test database
  await disconnectTestDB();
});

// Test utilities
global.testUtils = {
  createMockObjectId: () => new mongoose.Types.ObjectId(),
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  expectValidationError: (error, field) => {
    expect(error.name).toBe('ValidationError');
    expect(error.errors[field]).toBeDefined();
  }
};
