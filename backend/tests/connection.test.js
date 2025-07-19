const { connectTestDB, disconnectTestDB, cleanupTestDB } = require('../utils/testDatabase');

describe('Database Connection Test', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await cleanupTestDB();
  });

  it('should connect to the database successfully', async () => {
    const mongoose = require('mongoose');
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  it('should create and retrieve a test user', async () => {
    const User = require('../models/User');
    
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const savedUser = await testUser.save();
    expect(savedUser.name).toBe('Test User');
    expect(savedUser.email).toBe('test@example.com');

    const foundUser = await User.findById(savedUser._id);
    expect(foundUser).toBeTruthy();
    expect(foundUser.name).toBe('Test User');
  });
});
