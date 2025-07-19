# 🧪 Testing Documentation

This document outlines the comprehensive testing strategy for the Task Manager application, including unit tests, integration tests, and CI/CD integration with actual implemented test suites.

## 📋 Testing Overview

Our testing strategy covers:
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database interaction testing  
- **UI Tests**: React component testing with user interactions
- **E2E Tests**: Complete user workflow testing (future enhancement)

## 🔧 Backend Testing

### Test Stack
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory database for isolated testing
- **ESLint**: Code quality and style checking

### Running Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Test Structure
```
backend/
├── tests/
│   ├── setup.js           # Global test configuration
│   ├── auth.test.js       # Authentication endpoints
│   ├── tasks.test.js      # Task CRUD operations
│   └── utils.test.js      # Utility functions
├── utils/
│   └── testHelpers.js     # Testing utility functions
└── jest.config.js         # Jest configuration
```

### Unit Tests Coverage

#### Authentication Tests (`auth.test.js`)
- ✅ User registration with valid data
- ✅ Registration validation (invalid email, mismatched passwords)
- ✅ User login with valid credentials
- ✅ Login failure scenarios (invalid email/password)
- ✅ JWT token generation and validation

#### Task Management Tests (`tasks.test.js`)
- ✅ Create task with valid data
- ✅ Create task validation (missing required fields)
- ✅ Due date warning for past dates
- ✅ Get tasks with authentication
- ✅ Filter tasks by status and priority
- ✅ Update existing tasks
- ✅ Delete tasks and verification
- ✅ Task statistics generation
- ✅ Authentication requirements for all endpoints

#### Utility Functions Tests (`utils.test.js`)
- ✅ Date formatting functionality
- ✅ Priority and status validation
- ✅ Overdue task detection
- ✅ Completion rate calculation
- ✅ Edge cases and error handling

      const error = await user.save().catch(err => err);

      expect(error.errors.email.message).toContain('valid email');
    });
  });
});
```

**Task Model Tests** (`task.model.test.js`):
```javascript
describe('Task Model', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  describe('Task Creation', () => {
    it('should create task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        userId: testUser._id,
        status: 'pending',
        priority: 'medium'
      };

      const task = await Task.create(taskData);

      expect(task.title).toBe('Test Task');
      expect(task.userId.toString()).toBe(testUser._id.toString());
      expect(task.status).toBe('pending');
    });

    it('should set default values', async () => {
      const task = await Task.create({
        title: 'Test Task',
        userId: testUser._id
      });

      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
      expect(task.createdAt).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should require title and userId', async () => {
      const task = new Task({});

      const error = await task.save().catch(err => err);

      expect(error.errors.title).toBeDefined();
      expect(error.errors.userId).toBeDefined();
    });

    it('should validate status enum', async () => {
      const task = new Task({
        title: 'Test Task',
        userId: testUser._id,
        status: 'invalid-status'
      });

      const error = await task.save().catch(err => err);

      expect(error.errors.status).toBeDefined();
    });
  });
});
```

#### 2. Controller Tests (`tests/unit/controllers/`)

**Auth Controller Tests** (`auth.controller.test.js`):
```javascript
describe('Auth Controller', () => {
  describe('register', () => {
    it('should register new user successfully', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          user: expect.objectContaining({
            email: 'test@example.com'
          }),
          token: expect.any(String)
        })
      );
    });

    it('should handle duplicate email error', async () => {
      // Create user first
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123'
      });

      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: expect.stringContaining('already exists')
        })
      );
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should login with valid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          token: expect.any(String)
        })
      );
    });

    it('should reject invalid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Invalid email or password'
        })
      );
    });
  });
});
```

#### 3. Middleware Tests (`tests/unit/middleware/`)

**Auth Middleware Tests** (`auth.middleware.test.js`):
```javascript
describe('Auth Middleware', () => {
  let testUser;
  let validToken;

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    validToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
  });

  it('should authenticate valid token', async () => {
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };
    const res = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toBe(testUser._id.toString());
    expect(next).toHaveBeenCalled();
  });

  it('should reject missing token', async () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject invalid token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

### Integration Tests

#### API Integration Tests (`tests/integration/api.test.js`):

```javascript
describe('API Integration Tests', () => {
  let app;
  let testUser;
  let authToken;

  beforeAll(async () => {
    app = require('../../src/app');
    await connectDB();
  });

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create test user and get auth token
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    testUser = response.body.user;
    authToken = response.body.token;
  });

  describe('Task Management Flow', () => {
    it('should complete full task lifecycle', async () => {
      // Create task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Integration Test Task',
          description: 'Test task for integration testing',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.status).toBe('success');

      const taskId = createResponse.body.data.task._id;

      // Get task
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.task.title).toBe('Integration Test Task');

      // Update task
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Integration Test Task',
          status: 'in-progress'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.task.title).toBe('Updated Integration Test Task');
      expect(updateResponse.body.data.task.status).toBe('in-progress');

      // Delete task
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const verifyResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(verifyResponse.status).toBe(404);
    });

    it('should handle task filtering and pagination', async () => {
      // Create multiple tasks
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'low' },
        { title: 'Task 2', status: 'in-progress', priority: 'medium' },
        { title: 'Task 3', status: 'completed', priority: 'high' },
        { title: 'Task 4', status: 'pending', priority: 'high' }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(task);
      }

      // Test status filtering
      const pendingResponse = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`);

      expect(pendingResponse.status).toBe(200);
      expect(pendingResponse.body.data.tasks).toHaveLength(2);

      // Test priority filtering
      const highPriorityResponse = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`);

      expect(highPriorityResponse.status).toBe(200);
      expect(highPriorityResponse.body.data.tasks).toHaveLength(2);

      // Test pagination
      const paginatedResponse = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(paginatedResponse.status).toBe(200);
      expect(paginatedResponse.body.data.tasks).toHaveLength(2);
      expect(paginatedResponse.body.pagination.totalPages).toBe(2);
    });
  });

  describe('Authentication Flow', () => {
    it('should handle complete auth flow', async () => {
      // Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.token).toBeDefined();

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();

      // Access protected route
      const protectedResponse = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(protectedResponse.status).toBe(200);
    });
  });
});
```

## Frontend Testing Strategy

### Unit Tests

#### Component Tests (`src/components/__tests__/`):

**TaskCard Component Test**:
```typescript
describe('TaskCard Component', () => {
  const mockTask: Task = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockProps = {
    task: mockTask,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task information correctly', () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard {...mockProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard {...mockProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTask._id);
  });

  it('should show overdue styling for past due tasks', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: new Date('2020-01-01'),
      status: 'pending' as const
    };

    render(<TaskCard {...{ ...mockProps, task: overdueTask }} />);

    const taskCard = screen.getByTestId('task-card');
    expect(taskCard).toHaveClass('border-red-500');
  });
});
```

**TaskForm Component Test**:
```typescript
describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('should submit form with correct data', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'Task description');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'Task description',
        priority: 'high'
      })
    );
  });

  it('should show validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it('should populate form when editing existing task', () => {
    const existingTask: Task = {
      _id: '1',
      title: 'Existing Task',
      description: 'Existing Description',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={existingTask}
      />
    );

    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
  });
});
```

### Integration Tests

#### Context Integration Tests:

```typescript
describe('Auth Context Integration', () => {
  const MockApp = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should handle complete authentication flow', async () => {
    const TestComponent = () => {
      const { user, login, logout, loading } = useAuth();

      return (
        <div>
          {loading && <div>Loading...</div>}
          {user ? (
            <div>
              <span>Welcome, {user.name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <button
              onClick={() => login('test@example.com', 'password123')}
            >
              Login
            </button>
          )}
        </div>
      );
    };

    // Mock successful login API call
    (apiService.login as jest.Mock).mockResolvedValue({
      user: { _id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'mock-token'
    });

    const user = userEvent.setup();
    render(<TestComponent />, { wrapper: MockApp });

    // Initial state
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

    // Login
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });

    // Logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Playwright E2E Tests (`tests/e2e/`):

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register and login new user', async ({ page }) => {
    // Go to registration page
    await page.goto('/register');

    // Fill registration form
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');

    // Submit registration
    await page.click('[data-testid="register-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');

    // Logout
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/login');

    // Login again
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Should be back at dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});

// tests/e2e/tasks.spec.ts
test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create, edit, and delete task', async ({ page }) => {
    // Create task
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'E2E Test Task');
    await page.fill('[data-testid="task-description-input"]', 'This is a test task');
    await page.selectOption('[data-testid="task-priority-select"]', 'high');
    await page.click('[data-testid="save-task-button"]');

    // Verify task appears in list
    await expect(page.locator('[data-testid="task-card"]')).toContainText('E2E Test Task');

    // Edit task
    await page.click('[data-testid="edit-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Updated E2E Test Task');
    await page.click('[data-testid="save-task-button"]');

    // Verify update
    await expect(page.locator('[data-testid="task-card"]')).toContainText('Updated E2E Test Task');

    // Delete task
    await page.click('[data-testid="delete-task-button"]');
    await page.click('[data-testid="confirm-delete-button"]');

    // Verify deletion
    await expect(page.locator('[data-testid="task-card"]')).not.toContainText('Updated E2E Test Task');
  });

  test('should filter tasks by status', async ({ page }) => {
    // Create tasks with different statuses
    const tasks = [
      { title: 'Pending Task', status: 'pending' },
      { title: 'In Progress Task', status: 'in-progress' },
      { title: 'Completed Task', status: 'completed' }
    ];

    for (const task of tasks) {
      await page.click('[data-testid="create-task-button"]');
      await page.fill('[data-testid="task-title-input"]', task.title);
      await page.selectOption('[data-testid="task-status-select"]', task.status);
      await page.click('[data-testid="save-task-button"]');
    }

    // Filter by pending
    await page.selectOption('[data-testid="status-filter"]', 'pending');
    await expect(page.locator('[data-testid="task-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="task-card"]')).toContainText('Pending Task');

    // Filter by completed
    await page.selectOption('[data-testid="status-filter"]', 'completed');
    await expect(page.locator('[data-testid="task-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="task-card"]')).toContainText('Completed Task');

    // Show all
    await page.selectOption('[data-testid="status-filter"]', 'all');
    await expect(page.locator('[data-testid="task-card"]')).toHaveCount(3);
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"
  variables:
    testEmail:
      - "user1@example.com"
      - "user2@example.com"
      - "user3@example.com"

scenarios:
  - name: "Authentication and Task Management"
    weight: 100
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ testEmail }}"
            password: "password123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - post:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            title: "Load Test Task {{ $randomString() }}"
            description: "Generated during load test"
            priority: "medium"
```

### Frontend Performance Testing

```typescript
// tests/performance/lighthouse.test.ts
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Performance Tests', () => {
  test('should meet lighthouse performance thresholds', async ({ page }) => {
    await page.goto('/dashboard');

    await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 95,
        'best-practices': 90,
        seo: 80
      },
      port: 9222
    });
  });
});
```

## Test Data Management

### Test Database Setup

```javascript
// tests/setup/database.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
```

### Test Fixtures

```typescript
// tests/fixtures/users.ts
export const testUsers = {
  regularUser: {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123'
  },
  adminUser: {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  }
};

// tests/fixtures/tasks.ts
export const testTasks = {
  pendingTask: {
    title: 'Pending Task',
    description: 'A task that is pending',
    status: 'pending',
    priority: 'medium'
  },
  completedTask: {
    title: 'Completed Task',
    description: 'A task that is completed',
    status: 'completed',
    priority: 'low'
  },
  highPriorityTask: {
    title: 'High Priority Task',
    description: 'An urgent task',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  }
};
```

## Test Execution

### Running Tests

```bash
# Backend tests
npm run test              # Run all tests
npm run test:unit         # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report

# Frontend tests
npm run test              # Run all tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Run tests with coverage

# E2E tests
npm run test:e2e          # Run all E2E tests
npm run test:e2e:headed   # Run E2E tests with browser UI

# Performance tests
npm run test:perf         # Run performance tests
npm run test:lighthouse   # Run Lighthouse audits
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          directory: ./frontend/coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx playwright install
      - run: npm run test:e2e
```

This comprehensive testing strategy ensures high-quality, reliable code through multiple layers of testing, from unit tests to end-to-end scenarios, with performance and accessibility considerations built in.
