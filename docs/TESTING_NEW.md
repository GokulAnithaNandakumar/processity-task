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

### Integration Test Examples

#### API Endpoint Testing
```javascript
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
  });
});
```

#### Database Mocking
```javascript
// Uses MongoDB Memory Server for isolated testing
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

### Test Coverage Goals
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## 🎨 Frontend Testing

### Test Stack
- **Vitest**: Fast testing framework for Vite projects
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Custom Jest matchers for DOM elements
- **User Event**: Simulating user interactions

### Running Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
frontend/src/
├── tests/
│   ├── setup.ts           # Test configuration
│   ├── LoginForm.test.tsx # Authentication component
│   ├── TaskCard.test.tsx  # Task display component
│   └── TaskForm.test.tsx  # Task creation/editing
└── components/            # Component source files
```

### Component Testing Coverage

#### LoginForm Tests (`LoginForm.test.tsx`)
- ✅ Renders form elements correctly
- ✅ Handles user input (email, password)
- ✅ Calls login function with correct credentials
- ✅ Navigates to dashboard on successful login
- ✅ Displays error messages
- ✅ Shows loading state
- ✅ Password visibility toggle

#### TaskCard Tests (`TaskCard.test.tsx`)
- ✅ Renders task information correctly
- ✅ Displays overdue indicators
- ✅ Shows completed late warnings
- ✅ Edit and delete button functionality
- ✅ Date formatting
- ✅ Priority and status styling
- ✅ Description truncation

#### TaskForm Tests (`TaskForm.test.tsx`)
- ✅ Create vs Edit mode rendering
- ✅ Form validation (required fields)
- ✅ Create and update operations
- ✅ Loading and error states
- ✅ Cancel functionality
- ✅ Success callbacks
- ✅ Status and priority selection

### Mocking Strategy

#### API Hooks Mocking
```typescript
// Mock the auth hook
const mockLogin = vi.fn();
const mockUseAuth = vi.fn(() => ({
  login: mockLogin,
  loading: false,
  error: null,
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}));
```

#### Router Mocking
```typescript
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
```

## 🔄 Continuous Integration

### GitHub Actions Workflow

The CI/CD pipeline runs tests automatically on:
- Every push to main branch
- Pull requests to main branch

#### Test Pipeline Steps

1. **Backend Testing**:
   ```yaml
   - name: Install backend dependencies
     run: cd backend && npm ci

   - name: Run backend tests
     run: cd backend && npm test
     env:
       NODE_ENV: test
       MONGODB_URI: mongodb://localhost:27017/taskmanager_test
   ```

2. **Frontend Testing**:
   ```yaml
   - name: Install frontend dependencies
     run: cd frontend && npm ci

   - name: Run frontend tests
     run: cd frontend && npm run test -- --run
     env:
       CI: true
   ```

3. **Deployment** (only after tests pass):
   - Infrastructure deployment
   - Backend deployment
   - Frontend deployment

### Quality Gates

Deployment only proceeds if:
- ✅ All backend tests pass
- ✅ All frontend tests pass
- ✅ Code coverage meets minimum thresholds
- ✅ Linting passes without errors

## 📊 Test Coverage Reports

### Backend Coverage Example
```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   92.31 |    85.71 |   94.44 |   92.31 |
 models               |   89.47 |    77.78 |   88.89 |   89.47 |
  Task.js             |   90.91 |    83.33 |   85.71 |   90.91 | 15,23
  User.js             |   88.24 |    71.43 |   92.86 |   88.24 | 18,31
 routes               |   94.74 |    89.66 |   96.77 |   94.74 |
  auth.js             |   96.15 |    92.31 |   95.45 |   96.15 | 42
  tasks.js            |   93.33 |    87.50 |   97.78 |   93.33 | 78,145
 utils                |   91.67 |    83.33 |   94.12 |   91.67 |
  testHelpers.js      |   95.24 |    88.89 |   93.75 |   95.24 | 67
----------------------|---------|----------|---------|---------|-------------------
```

### Frontend Coverage Example
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   88.46 |    82.14 |   90.32 |   88.46 |
 components/auth    |   91.67 |    85.71 |   92.86 |   91.67 |
  LoginForm.tsx     |   94.12 |    88.89 |   95.45 |   94.12 | 45,67
  RegisterForm.tsx  |   89.47 |    82.35 |   90.48 |   89.47 | 23,56,78
 components/tasks   |   85.71 |    78.95 |   87.50 |   85.71 |
  TaskCard.tsx      |   88.24 |    81.25 |   89.29 |   88.24 | 34,89,112
  TaskForm.tsx      |   83.33 |    76.92 |   85.71 |   83.33 | 56,98,134,167
--------------------|---------|----------|---------|---------|-------------------
```

## 🐛 Testing Best Practices

### Unit Testing
1. **Test one thing at a time**: Each test should focus on a single behavior
2. **Use descriptive names**: Test names should clearly describe what is being tested
3. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification
4. **Mock external dependencies**: Isolate units under test
5. **Test edge cases**: Include boundary conditions and error scenarios

### Integration Testing
1. **Test real interactions**: Use actual database and API calls
2. **Clean state**: Ensure tests don't affect each other
3. **Test complete workflows**: Cover end-to-end user scenarios
4. **Verify side effects**: Check database changes, external API calls
5. **Performance considerations**: Monitor test execution time

### Component Testing
1. **Test user interactions**: Simulate real user behavior
2. **Test accessibility**: Verify screen reader compatibility
3. **Test different states**: Loading, error, success states
4. **Mock props and context**: Control component inputs
5. **Snapshot testing**: Catch unexpected UI changes

## 📝 Writing New Tests

### Backend Test Template
```javascript
describe('Feature Name', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Setup test data
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    authToken = loginResponse.body.token;
  });

  afterEach(async () => {
    // Cleanup
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  it('should handle specific scenario', async () => {
    // Arrange
    const testData = { /* test data */ };

    // Act
    const response = await request(app)
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});
```

### Frontend Test Template
```typescript
describe('ComponentName', () => {
  const mockProps = {
    onAction: vi.fn(),
    data: mockData,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<ComponentName {...mockProps} />);

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<ComponentName {...mockProps} />);

    const button = screen.getByRole('button', { name: /action/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockProps.onAction).toHaveBeenCalledWith(expectedArgs);
    });
  });
});
```

## 🚀 Future Enhancements

### Planned Testing Improvements
1. **E2E Testing**: Implement Cypress for complete user workflow testing
2. **Visual Regression Testing**: Add screenshot comparison tests
3. **Performance Testing**: Load testing for API endpoints
4. **Security Testing**: Automated security vulnerability scanning
5. **API Contract Testing**: Ensure API compatibility across versions

### Monitoring and Metrics
- Test execution time tracking
- Flaky test detection and reporting
- Coverage trend analysis
- Performance regression detection

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
