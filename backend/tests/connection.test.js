const { connectTestDB, disconnectTestDB, cleanupTestDB } = require('../utils/testDatabase');

describe('Database Connection Test', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  // Don't use global cleanup for these tests since we're testing the database operations
  beforeEach(async () => {
    await cleanupTestDB();
  });

  it('should connect to the database successfully', async () => {
    const mongoose = require('mongoose');
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  it('should create and retrieve a test user', async () => {
    const User = require('../models/User');

    // Use a unique email for each test run
    const uniqueEmail = `test-${Date.now()}@example.com`;

    const testUser = new User({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    });

    const savedUser = await testUser.save();
    expect(savedUser.name).toBe('Test User');
    expect(savedUser.email).toBe(uniqueEmail);
    expect(savedUser._id).toBeDefined();

    const foundUser = await User.findById(savedUser._id);
    expect(foundUser).toBeTruthy();
    expect(foundUser.name).toBe('Test User');
    expect(foundUser.email).toBe(uniqueEmail);
  });

  it('should create and retrieve a test task', async () => {
    const User = require('../models/User');
    const Task = require('../models/Task');

    // Create a test user first with unique email
    const uniqueEmail = `test-task-${Date.now()}@example.com`;
    const testUser = new User({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    });
    const savedUser = await testUser.save();

    // Create a test task
    const testTask = new Task({
      title: 'Test Task',
      description: 'Test Description',
      user: savedUser._id, // Use 'user' instead of 'userId'
      status: 'pending',
      priority: 'medium'
    });

    const savedTask = await testTask.save();
    expect(savedTask.title).toBe('Test Task');
    expect(savedTask.description).toBe('Test Description');
    expect(savedTask.user.toString()).toBe(savedUser._id.toString());

    const foundTask = await Task.findById(savedTask._id);
    expect(foundTask).toBeTruthy();
    expect(foundTask.title).toBe('Test Task');
  });
});
