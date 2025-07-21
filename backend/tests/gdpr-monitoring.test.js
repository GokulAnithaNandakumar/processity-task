const request = require('supertest');
const app = require('../server');
const testDatabase = require('../utils/testDatabase');
const { createTestUser, getTestToken } = require('../utils/testHelpers');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

describe('GDPR Compliance Endpoints', () => {
  let testUser;
  let testToken;

  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clearDatabase();
    await testDatabase.closeDatabase();
  });

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    testUser = await createTestUser();
    testToken = getTestToken(testUser._id);
  });

  describe('GET /api/gdpr/export', () => {
    test('should export user data successfully', async () => {
      const response = await request(app)
        .get('/api/gdpr/export')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('exportMetadata');
      expect(response.body.data).toHaveProperty('personalData');
      expect(response.body.data).toHaveProperty('summary');

      // Check metadata
      expect(response.body.data.exportMetadata).toHaveProperty('userId');
      expect(response.body.data.exportMetadata).toHaveProperty('exportDate');
      expect(response.body.data.exportMetadata).toHaveProperty('legalBasis');

      // Check personal data structure
      expect(response.body.data.personalData).toHaveProperty('profile');
      expect(response.body.data.personalData).toHaveProperty('tasks');
      expect(response.body.data.personalData).toHaveProperty('auditTrail');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/gdpr/export');

      expect(response.status).toBe(401);
    });

    test('should create audit log for data export', async () => {
      await request(app)
        .get('/api/gdpr/export')
        .set('Authorization', `Bearer ${testToken}`);

      const auditLog = await AuditLog.findOne({
        userId: testUser._id,
        action: 'DATA_EXPORT'
      });

      expect(auditLog).toBeTruthy();
      expect(auditLog.success).toBe(true);
      expect(auditLog.category).toBe('DATA_ACCESS');
    });
  });

  describe('POST /api/gdpr/delete-request', () => {
    test('should create deletion request successfully', async () => {
      const response = await request(app)
        .post('/api/gdpr/delete-request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          confirmEmail: testUser.email,
          confirmPassword: 'password123',
          reason: 'No longer need the service'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('requestDate');
      expect(response.body.data).toHaveProperty('processing');
      expect(response.body.data).toHaveProperty('nextSteps');

      // Check user was marked for deletion
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.deletionRequested).toBe(true);
      expect(updatedUser.status).toBe('pending_deletion');
    });

    test('should fail with wrong email confirmation', async () => {
      const response = await request(app)
        .post('/api/gdpr/delete-request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          confirmEmail: 'wrong@email.com',
          confirmPassword: 'password123',
          reason: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Email confirmation does not match');
    });

    test('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/gdpr/delete-request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          confirmEmail: testUser.email,
          confirmPassword: 'wrongpassword',
          reason: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid password confirmation');
    });

    test('should create audit log for deletion request', async () => {
      await request(app)
        .post('/api/gdpr/delete-request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          confirmEmail: testUser.email,
          confirmPassword: 'password123',
          reason: 'Test deletion'
        });

      const auditLog = await AuditLog.findOne({
        userId: testUser._id,
        action: 'DATA_DELETE_REQUEST'
      });

      expect(auditLog).toBeTruthy();
      expect(auditLog.success).toBe(true);
      expect(auditLog.category).toBe('DATA_ACCESS');
      expect(auditLog.severity).toBe('HIGH');
    });
  });

  describe('GET /api/gdpr/data-summary', () => {
    test('should return data summary successfully', async () => {
      const response = await request(app)
        .get('/api/gdpr/data-summary')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data).toHaveProperty('dataStats');
      expect(response.body.data).toHaveProperty('dataRetention');
      expect(response.body.data).toHaveProperty('yourRights');
      expect(response.body.data).toHaveProperty('dataProcessing');

      // Check profile data
      expect(response.body.data.profile.name).toBe(testUser.name);
      expect(response.body.data.profile.email).toBe(testUser.email);

      // Check rights information
      expect(response.body.data.yourRights).toHaveProperty('access');
      expect(response.body.data.yourRights).toHaveProperty('rectification');
      expect(response.body.data.yourRights).toHaveProperty('erasure');
      expect(response.body.data.yourRights).toHaveProperty('portability');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/gdpr/data-summary');

      expect(response.status).toBe(401);
    });
  });
});

describe('Monitoring Endpoints', () => {
  let testUser;
  let testToken;

  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clearDatabase();
    await testDatabase.closeDatabase();
  });

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    testUser = await createTestUser();
    testToken = getTestToken(testUser._id);
  });

  describe('GET /api/monitoring/health', () => {
    test('should return health status successfully', async () => {
      const response = await request(app)
        .get('/api/monitoring/health')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('checks');

      // Check health checks structure
      expect(response.body.data.checks).toHaveProperty('database');
      expect(response.body.data.checks).toHaveProperty('memory');
      expect(response.body.data.checks).toHaveProperty('uptime');
      expect(response.body.data.checks).toHaveProperty('environment');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/monitoring/health');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/monitoring/metrics', () => {
    test('should return application metrics successfully', async () => {
      const response = await request(app)
        .get('/api/monitoring/metrics')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('application');
      expect(response.body.data).toHaveProperty('requests');
      expect(response.body.data).toHaveProperty('security');

      // Check application metrics
      expect(response.body.data.application).toHaveProperty('uptime');
      expect(response.body.data.application).toHaveProperty('memory');
      expect(response.body.data.application).toHaveProperty('cpu');

      // Check security metrics
      expect(response.body.data.security).toHaveProperty('recentFailedLogins');
      expect(response.body.data.security).toHaveProperty('recentSecurityEvents');
      expect(response.body.data.security).toHaveProperty('criticalEvents');
    });
  });

  describe('GET /api/monitoring/security-events', () => {
    test('should return security events successfully', async () => {
      const response = await request(app)
        .get('/api/monitoring/security-events')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('timeframe');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('events');
      expect(response.body.data).toHaveProperty('analysis');

      // Check events structure
      expect(response.body.data.events).toHaveProperty('security');
      expect(response.body.data.events).toHaveProperty('failedLogins');
      expect(response.body.data.events).toHaveProperty('critical');

      // Check analysis
      expect(response.body.data.analysis).toHaveProperty('uniqueFailedLoginIPs');
      expect(response.body.data.analysis).toHaveProperty('alertLevel');
    });

    test('should accept query parameters', async () => {
      const response = await request(app)
        .get('/api/monitoring/security-events?hours=12&limit=25')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.timeframe).toBe('12 hours');
    });
  });

  describe('POST /api/monitoring/alert', () => {
    test('should create manual alert successfully', async () => {
      const alertData = {
        severity: 'HIGH',
        type: 'MANUAL_TEST',
        message: 'Test alert message',
        details: { testData: 'value' }
      };

      const response = await request(app)
        .post('/api/monitoring/alert')
        .set('Authorization', `Bearer ${testToken}`)
        .send(alertData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('severity', 'HIGH');
      expect(response.body.data).toHaveProperty('type', 'MANUAL_TEST');
      expect(response.body.data).toHaveProperty('message', 'Test alert message');
      expect(response.body.data).toHaveProperty('createdBy', testUser.email);
    });

    test('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/monitoring/alert')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          severity: 'HIGH'
          // Missing type and message
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });
});

describe('Audit Logging', () => {
  let testUser;
  let testToken;

  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clearDatabase();
    await testDatabase.closeDatabase();
  });

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    testUser = await createTestUser();
    testToken = getTestToken(testUser._id);
  });

  test('should create audit log for successful login', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password123'
      });

    const auditLog = await AuditLog.findOne({
      userEmail: testUser.email,
      action: 'USER_LOGIN',
      success: true
    });

    expect(auditLog).toBeTruthy();
    expect(auditLog.category).toBe('AUTHENTICATION');
    expect(auditLog.severity).toBe('LOW');
    expect(auditLog.ipAddress).toBeTruthy();
    expect(auditLog.userAgent).toBeTruthy();
  });

  test('should create audit log for failed login', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    const auditLog = await AuditLog.findOne({
      userEmail: testUser.email,
      action: 'USER_LOGIN',
      success: false
    });

    expect(auditLog).toBeTruthy();
    expect(auditLog.category).toBe('AUTHENTICATION');
    expect(auditLog.severity).toBe('HIGH');
    expect(auditLog.errorMessage).toBeTruthy();
  });

  test('should create audit log for task creation', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high'
    };

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${testToken}`)
      .send(taskData);

    const auditLog = await AuditLog.findOne({
      userId: testUser._id,
      action: 'TASK_CREATE',
      success: true
    });

    expect(auditLog).toBeTruthy();
    expect(auditLog.category).toBe('DATA_MODIFICATION');
    expect(auditLog.resource).toBe('task');
    expect(auditLog.details.body.title).toBe('Test Task');
  });
});
