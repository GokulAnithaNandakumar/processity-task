const mongoose = require('mongoose');
require('dotenv').config();

// Setup test database
beforeAll(async () => {
  const url = 'mongodb://localhost:27017/taskmanager_test';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Cleanup
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});
