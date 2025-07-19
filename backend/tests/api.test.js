const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });
});

describe('Task Endpoints', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create and login user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    userId = user._id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.task.title).toBe(taskData.title);
    });

    it('should not create task without authentication', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      await Task.create([
        { title: 'Task 1', user: userId, status: 'pending' },
        { title: 'Task 2', user: userId, status: 'completed' }
      ]);
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toHaveLength(2);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].status).toBe('pending');
    });
  });
});
