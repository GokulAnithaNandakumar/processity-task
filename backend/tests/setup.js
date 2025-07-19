const mongoose = require('mongoose');
require('dotenv').config();

// Setup test database
beforeAll(async () => {
  // Close any existing connection first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  // Use the dedicated test database
  const url = process.env.MONGODB_TEST_URI;
  console.log('Test database URL:', url.replace(/\/\/.*:.*@/, '//***:***@')); // Log without credentials
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Cleanup
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});
