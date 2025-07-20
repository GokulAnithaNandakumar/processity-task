const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const { createTestUser } = require('../utils/testDatabase');
const Task = require('../models/Task');

let authToken;
let testUser;

describe('Auth API Endpoints', () => {
  // Increase timeout for individual tests
  jest.setTimeout(60000);

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
      const userData = {
        name: 'Test User',
        email: uniqueEmail,
        password: 'testpass123',
        confirmPassword: 'testpass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Debug logging for failures
      if (response.status !== 201) {
        console.log('❌ Register test failed:');
        console.log('Status:', response.status);
        console.log('Response body:', JSON.stringify(response.body, null, 2));
        console.log('Response text:', response.text);
      }

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'testpass123',
        confirmPassword: 'testpass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should not register user with mismatched passwords', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123',
        confirmPassword: 'differentpass'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUserEmail;

    beforeEach(async () => {
      // Create a test user with unique email
      testUserEmail = `test-login-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
      const user = new User({
        name: 'Test User',
        email: testUserEmail,
        password: 'testpass123'
      });
      testUser = await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: 'testpass123'
        });

      // Debug logging for failures
      if (response.status !== 200) {
        console.log('❌ Login test failed:');
        console.log('Status:', response.status);
        console.log('Response body:', JSON.stringify(response.body, null, 2));
        console.log('Response text:', response.text);
        console.log('Test user email:', testUserEmail);
      }

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe(testUserEmail);

      authToken = response.body.token;
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'testpass123'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });
});
