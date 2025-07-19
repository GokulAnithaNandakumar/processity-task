const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');
const { createTestUser, createTestTask } = require('../utils/testDatabase');

let authToken;
let testUser;
let testTask;

describe('Tasks API Endpoints', () => {
  // Increase timeout for individual tests
  jest.setTimeout(60000);

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create and login user for authenticated requests
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpass123'
    });
    testUser = await user.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpass123'
      });

    authToken = loginResponse.body.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task.title).toBe(taskData.title);
      expect(response.body.data.task.user).toBe(testUser._id.toString());
    });

    it('should not create task without authentication', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should not create task with invalid data', async () => {
      const taskData = {
        // Missing required title
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return warning for past due date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const taskData = {
        title: 'Overdue Task',
        description: 'This task has a past due date',
        status: 'pending',
        priority: 'high',
        dueDate: pastDate.toISOString()
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.warning).toBeDefined();
      expect(response.body.warning).toContain('Due date is in the past');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      await Task.create([
        {
          title: 'Task 1',
          user: testUser._id,
          status: 'pending',
          priority: 'high'
        },
        {
          title: 'Task 2',
          user: testUser._id,
          status: 'completed',
          priority: 'medium'
        }
      ]);
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.results).toBe(2);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].status).toBe('pending');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].priority).toBe('high');
    });

    it('should not get tasks without authentication', async () => {
      const response = await request(app)
        .get('/api/tasks');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Original Title',
        description: 'Original Description',
        user: testUser._id,
        status: 'pending',
        priority: 'medium'
      });
      testTask = task;
    });

    it('should update task with valid data', async () => {
      const updateData = {
        title: 'Updated Title',
        status: 'completed',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task.title).toBe(updateData.title);
      expect(response.body.data.task.status).toBe(updateData.status);
    });

    it('should not update non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        user: testUser._id,
        status: 'pending',
        priority: 'low'
      });
      testTask = task;
    });

    it('should delete task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is actually deleted
      const deletedTask = await Task.findById(testTask._id);
      expect(deletedTask).toBeNull();
    });

    it('should not delete non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/tasks/stats/overview', () => {
    beforeEach(async () => {
      // Create tasks with different statuses
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await Task.create([
        { title: 'Pending Task 1', user: testUser._id, status: 'pending', priority: 'high' },
        { title: 'Pending Task 2', user: testUser._id, status: 'pending', priority: 'medium' },
        { title: 'In Progress Task', user: testUser._id, status: 'in-progress', priority: 'high' },
        { title: 'Completed Task', user: testUser._id, status: 'completed', priority: 'low' },
        {
          title: 'Overdue Task',
          user: testUser._id,
          status: 'pending',
          priority: 'high',
          dueDate: pastDate
        }
      ]);
    });

    it('should get task statistics', async () => {
      const response = await request(app)
        .get('/api/tasks/stats/overview')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.total).toBe(5);
      expect(response.body.data.overdue).toBe(1);
      expect(response.body.data.stats).toHaveLength(3); // pending, in-progress, completed
    });

    it('should not get stats without authentication', async () => {
      const response = await request(app)
        .get('/api/tasks/stats/overview');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });
});
