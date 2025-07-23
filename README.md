# 🚀 Processity Task Manager

> **A modern, full-stack task management application showcasing enterprise-grade architecture, security, and cloud deployment practices.**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Azure](https://img.shields.io/badge/Azure-Cloud-blue.svg)](https://azure.microsoft.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.x-blue.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌐 Live Deployment

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (React)** | [jolly-desert-0d7a9d110.1.azurestaticapps.net](https://jolly-desert-0d7a9d110.1.azurestaticapps.net) | ✅ Live |
| **Backend API** | [taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net](https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net) | ✅ Live |
| **API Health Check** | [/api/health](https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net/api/health) | ✅ Monitoring |

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [🔒 Security](#-security)
- [☁️ Deployment](#️-deployment)
- [📊 Monitoring](#-monitoring)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Project Overview

Processity Task Manager is a comprehensive, production-ready task management application that demonstrates modern software development practices, including:

- **Enterprise Architecture**: Scalable, maintainable codebase with clean separation of concerns
- **Security First**: JWT authentication, password validation, CORS protection, and secure API design
- **Cloud Native**: Azure-hosted with global CDN, auto-scaling, and infrastructure as code
- **Developer Experience**: Hot reloading, TypeScript, comprehensive testing, and CI/CD automation
- **User Experience**: Responsive design, loading states, error handling, and accessibility features

## ✨ Key Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with secure token management
- **Strong Password Validation** (uppercase, lowercase, numbers, special characters)
- **Protected Routes** with automatic redirects
- **Secure Password Hashing** using bcrypt
- **Input Validation & Sanitization** across all endpoints

### 📝 **Task Management**
- **Full CRUD Operations** (Create, Read, Update, Delete)
- **Task Status Tracking** (Pending, In Progress, Completed)
- **Priority Levels** (Low, Medium, High)
- **Due Date Management** with overdue detection
- **Advanced Filtering** by status, priority, and date
- **Real-time Task Statistics** dashboard

### 🎨 **User Experience**
- **Material-UI Design System** with consistent theming
- **Responsive Layout** optimized for desktop and mobile
- **Loading States** with skeleton screens and spinners
- **Error Handling** with user-friendly messages
- **Form Validation** with real-time feedback
- **Progressive Web App** ready features

### 🏗️ **Technical Excellence**
- **TypeScript** for type safety and better developer experience
- **Custom React Hooks** for reusable logic
- **Context API** for state management
- **Axios Interceptors** for API request/response handling
- **Comprehensive Testing** with unit and integration tests
- **ESLint & Prettier** for code quality

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React SPA<br/>TypeScript + Material-UI]
    end

    subgraph "API Layer"
        B[Express.js REST API<br/>Node.js + JWT Auth]
    end

    subgraph "Data Layer"
        C[MongoDB Atlas<br/>Cloud Database]
    end

    subgraph "Azure Cloud Infrastructure"
        D[Azure Static Web Apps<br/>Global CDN]
        E[Azure App Service<br/>Linux Container]
        F[Azure Key Vault<br/>Secrets Management]
        G[Application Insights<br/>Monitoring & Logs]
    end

    A -->|HTTPS/REST| B
    B -->|Mongoose ODM| C
    A -.->|Hosted on| D
    B -.->|Deployed to| E
    B -.->|Secrets from| F
    E -.->|Telemetry to| G
```

### System Architecture Principles

- **Microservices Ready**: Loosely coupled frontend and backend
- **Stateless API**: JWT tokens for session management
- **Database Separation**: Dedicated MongoDB Atlas cluster
- **CDN Distribution**: Global content delivery for optimal performance
- **Infrastructure as Code**: Azure Bicep templates for reproducible deployments
- **Observability**: Comprehensive logging and monitoring

## 🛠️ Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI Framework with Hooks |
| **TypeScript** | 5.x | Type Safety & Developer Experience |
| **Material-UI** | 7.x | Design System & Components |
| **Vite** | Latest | Build Tool & Dev Server |
| **Axios** | 1.x | HTTP Client with Interceptors |
| **React Router** | 6.x | Client-side Routing |
| **Vitest** | Latest | Testing Framework |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 LTS | JavaScript Runtime |
| **Express.js** | 4.x | Web Framework |
| **MongoDB** | 7.x | NoSQL Database |
| **Mongoose** | 8.x | Object Document Mapper |
| **JSON Web Token** | 9.x | Authentication |
| **bcryptjs** | 2.x | Password Hashing |
| **Jest** | 29.x | Testing Framework |

### Infrastructure & DevOps
| Service | Purpose |
|---------|---------|
| **Azure Static Web Apps** | Frontend Hosting + CDN |
| **Azure App Service** | Backend API Hosting |
| **MongoDB Atlas** | Managed Database Service |
| **Azure Key Vault** | Secrets Management |
| **Application Insights** | APM & Monitoring |
| **GitHub Actions** | CI/CD Pipeline |
| **Azure Bicep** | Infrastructure as Code |

## � Project Structure

```
processity-task/
├── 📁 frontend/                    # React TypeScript Application
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI Components
│   │   │   ├── 📁 auth/           # Authentication Components
│   │   │   ├── 📁 common/         # Shared Components
│   │   │   ├── 📁 layout/         # Layout Components
│   │   │   ├── 📁 tasks/          # Task Management Components
│   │   │   └── 📁 ui/             # UI Components (LoadingButton, etc.)
│   │   ├── 📁 contexts/           # React Context Providers
│   │   ├── 📁 hooks/              # Custom React Hooks
│   │   ├── 📁 pages/              # Page Components
│   │   ├── 📁 services/           # API Service Layer
│   │   ├── 📁 types/              # TypeScript Type Definitions
│   │   └── 📁 tests/              # Test Files
│   ├── 📄 package.json            # Dependencies & Scripts
│   ├── 📄 vite.config.ts          # Vite Configuration
│   ├── 📄 tsconfig.json           # TypeScript Configuration
│   └── 📄 vitest.config.ts        # Testing Configuration
├── 📁 backend/                     # Node.js Express API
│   ├── 📁 routes/                 # API Route Handlers
│   ├── 📁 models/                 # Mongoose Data Models
│   ├── 📁 middleware/             # Express Middleware
│   ├── 📁 utils/                  # Utility Functions
│   ├── 📁 config/                 # Configuration Files
│   ├── 📁 tests/                  # API Test Suite
│   ├── 📄 server.js               # Application Entry Point
│   └── 📄 package.json            # Dependencies & Scripts
├── 📁 infrastructure/             # Azure Bicep Templates
│   ├── 📄 main.bicep              # Main Infrastructure Template
│   ├── 📄 app-service.bicep       # App Service Configuration
│   └── 📄 static-web-app.bicep    # Static Web App Configuration
├── 📁 .github/workflows/          # GitHub Actions CI/CD
│   ├── 📄 backend-deploy.yml      # Backend Deployment
│   └── 📄 frontend-deploy.yml     # Frontend Deployment
├── 📁 docs/                       # Project Documentation
│   ├── 📄 API.md                  # API Documentation
│   ├── 📄 DEPLOYMENT.md           # Deployment Guide
│   └── 📄 TESTING.md              # Testing Strategy
└── 📄 README.md                   # Project Overview (This File)
```
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Router** for client-side routing
- **React Hook Form** for form handling
- **Axios** for HTTP requests
- **Lucide React** for icons
- **Vitest** and **React Testing Library** for testing

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests
- **rate limiting** for API protection
- **Jest** and **Supertest** for testing

### Cloud & DevOps
- **Microsoft Azure** cloud platform
- **Azure App Service** for backend hosting (ZIP deployment)
- **Azure Static Web Apps** for frontend hosting (GitHub integration)
- **MongoDB Atlas** for cloud database
- **Azure Key Vault** for secrets management
- **Azure Application Insights** for monitoring
- **Azure Bicep** for Infrastructure as Code
- **GitHub Actions** for CI/CD automation

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** 10.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB Atlas Account** ([Sign up](https://www.mongodb.com/atlas))

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/GokulAnithaNandakumar/processity-task.git
   cd processity-task
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Copy environment template and configure
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install

   # Copy environment template and configure
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:3000
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Health Check: http://localhost:3000/api/health

### Environment Configuration

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=3000

# Security
BCRYPT_ROUNDS=12
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Environment
VITE_NODE_ENV=development
```

## 🔧 Development

### Available Scripts

#### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

#### Frontend Scripts
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

### Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature-name
   # Make your changes
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

2. **Testing**
   ```bash
   # Backend tests
   cd backend && npm test

   # Frontend tests
   cd frontend && npm test
   ```

3. **Code Quality**
   ```bash
   # Lint and format
   npm run lint

   # Type checking
   npm run type-check
   ```

### VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **ESLint**
- **Prettier**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Material Icon Theme**

## 🧪 Testing

### Testing Strategy

Our comprehensive testing approach includes:

#### Backend Testing (Jest + Supertest)
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: MongoDB integration testing
- **Authentication Tests**: JWT and bcrypt testing

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

**Test Coverage:**
- ✅ Authentication routes (register, login)
- ✅ Task CRUD operations
- ✅ Middleware (auth, validation)
- ✅ Database operations
- ✅ Error handling

#### Frontend Testing (Vitest + React Testing Library)
- **Component Tests**: UI component behavior
- **Hook Tests**: Custom React hooks
- **Integration Tests**: User workflow testing
- **API Integration**: Service layer testing

```bash
cd frontend
npm test                    # Run all tests
npm run test:ui            # Interactive UI
npm run test:coverage      # Coverage report
```

**Test Coverage:**
- ✅ Authentication components
- ✅ Task management components
- ✅ Custom hooks (useAuth, useTask)
- ✅ API service functions
- ✅ Form validation

### Example Test Files

**Backend Test Example:**
```javascript
// tests/auth.test.js
describe('Authentication', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('test@example.com');
  });
});
```

**Frontend Test Example:**
```typescript
// src/tests/LoginForm.test.tsx
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication with secure token management
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Protected Routes**: Middleware-based route protection
- **Token Expiration**: Configurable token lifetimes
- **Automatic Logout**: Invalid token detection and cleanup

### Input Validation & Sanitization

- **Express Validator**: Server-side input validation
- **Schema Validation**: MongoDB schema constraints
- **XSS Protection**: Input sanitization to prevent cross-site scripting
- **SQL Injection**: NoSQL injection prevention
- **Rate Limiting**: API endpoint protection against abuse

### Infrastructure Security

- **HTTPS Everywhere**: TLS encryption for all communications
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Security Headers**: Helmet.js for security headers
- **Environment Variables**: Secure secrets management
- **Azure Key Vault**: Cloud-based secrets storage

### Password Requirements

Strong password validation enforced:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Security Best Practices Implemented

```typescript
// JWT Token Management
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Password Validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

## ☁️ Deployment

### Azure Cloud Architecture

Our application is deployed using a modern cloud architecture:

```mermaid
graph TB
    subgraph "Internet"
        Users[Users]
    end

    subgraph "Azure Cloud"
        subgraph "Frontend Tier"
            SWA[Azure Static Web Apps<br/>Global CDN Distribution]
        end

        subgraph "Backend Tier"
            AS[Azure App Service<br/>Linux Container<br/>Auto-scaling]
        end

        subgraph "Security Tier"
            KV[Azure Key Vault<br/>Secrets Management]
        end

        subgraph "Monitoring Tier"
            AI[Application Insights<br/>APM & Logging]
        end
    end

    subgraph "External Services"
        MA[MongoDB Atlas<br/>Global Database]
    end

    Users -->|HTTPS| SWA
    SWA -->|API Calls| AS
    AS -->|Secrets| KV
    AS -->|Data| MA
    AS -->|Telemetry| AI
```

### Deployment Configuration

#### GitHub Actions CI/CD

**Backend Deployment:**
```yaml
# .github/workflows/backend-deploy.yml
name: Deploy Backend to Azure App Service
on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'taskmanager-api-prod'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: backend
```

**Frontend Deployment:**
```yaml
# .github/workflows/frontend-deploy.yml
name: Deploy Frontend to Azure Static Web Apps
on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "frontend"
          output_location: "dist"
```

### Infrastructure as Code

**Azure Bicep Template:**
```bicep
// infrastructure/main.bicep
param appName string = 'taskmanager'
param environment string = 'prod'

module appService 'app-service.bicep' = {
  name: 'appService'
  params: {
    appName: appName
    environment: environment
    runtime: 'NODE|20-lts'
  }
}

module staticWebApp 'static-web-app.bicep' = {
  name: 'staticWebApp'
  params: {
    appName: appName
    environment: environment
    repositoryUrl: 'https://github.com/GokulAnithaNandakumar/processity-task'
  }
}
```

### Environment Variables in Production

**Azure App Service Configuration:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secure JWT signing key
- `NODE_ENV`: production
- `PORT`: 3000 (or automatic)

**Azure Static Web Apps Configuration:**
- `VITE_API_URL`: Production API endpoint
- `VITE_NODE_ENV`: production

## 📊 Monitoring

### Application Insights Integration

Real-time monitoring and observability:

- **Performance Metrics**: Response times, throughput, error rates
- **Custom Events**: Business logic tracking
- **Exception Handling**: Automatic error reporting
- **User Analytics**: Session tracking and user flows
- **Dependency Tracking**: Database and external API calls

### Health Monitoring

**API Health Endpoint:**
```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  });
});
```

**Frontend Health Monitoring:**
```typescript
// Service health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};
```

### Performance Optimization

- **Bundle Optimization**: Tree-shaking and code splitting
- **CDN Distribution**: Global content delivery
- **Database Indexing**: Optimized MongoDB queries
- **Caching Strategies**: Response caching where appropriate
- **Auto-scaling**: Horizontal scaling based on demand

## 🤝 Contributing

We welcome contributions to improve the Processity Task Manager! Here's how you can contribute:

### Development Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/processity-task.git
   cd processity-task
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Run backend tests
   cd backend && npm test

   # Run frontend tests
   cd frontend && npm test

   # Ensure builds work
   npm run build
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   git push origin feature/amazing-new-feature
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all checks pass

### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Node.js**: Use async/await, proper error handling
- **Testing**: Write tests for new features
- **Documentation**: Update README and JSDoc comments

### Reporting Issues

If you find a bug or have a feature request:

1. Check existing issues first
2. Create a detailed issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

Our implementation followed this exact process:

1. **Created Azure Resources**:
   ```bash
   # Created resource group manually in Azure portal
   # Set up Azure App Service (Linux, Node.js 20)
   # Set up Azure Static Web Apps with GitHub integration
   # Configured MongoDB Atlas separately
   ```

2. **Set up GitHub Actions**:
   ```bash
   # Backend deployment workflow
   # Frontend deployment workflow
   # Individual test execution to avoid conflicts
   ```

3. **Database Configuration**:
   ```bash
   # MongoDB Atlas with GitHub Actions IP whitelisting
   # Test database for CI/CD pipelines
   # Production database for live deployment
   ```

### Running Tests

**Backend Tests (Individual Execution)**:
```bash
cd backend

# Run all tests together (may have conflicts)
npm test

# Or run individual test suites (recommended)
npm run test:connection  # Database connection tests (3 tests)
npm run test:utils      # Utility function tests (14 tests)
npm run test:auth       # Authentication tests (6 tests)
npm run test:tasks      # Task management tests (14 tests)

# Total: 38 backend tests
```

**Frontend Tests**:
```bash
cd frontend
npm run test            # Unit and integration tests
npm run test:unit       # Component tests only
npm run test:integration # Integration tests only
```

**Why Individual Test Execution?**
We implemented individual test suite execution because running all backend tests together caused database conflicts. Each test suite runs independently in CI/CD to ensure reliable results.

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication with secure token storage
- Password hashing using bcryptjs
- Protected routes requiring authentication
- User isolation (users can only access their own tasks)

### Security Best Practices
- HTTPS enforcement in production
- CORS configuration for specific origins
- Rate limiting to prevent abuse
- Input validation and sanitization
- SQL injection prevention through Mongoose ODM
- XSS prevention through proper data handling
- Secrets stored in Azure Key Vault
- Security headers via Helmet.js

### Compliance Considerations
- Audit logging for user actions
- Data isolation by user
- Secure password requirements
- Token expiration and refresh mechanisms

## 📊 Performance & Scalability

### Performance Optimizations
- **Frontend:**
  - Code splitting and lazy loading
  - Image optimization
  - Bundle size optimization with Vite
  - Caching strategies
  - Responsive design for mobile performance

- **Backend:**
  - Database indexing for query optimization
  - Connection pooling
  - Compression middleware
  - Efficient pagination
  - Query optimization

### Scalability Features
- Stateless API design for horizontal scaling
- Azure Auto-scaling capabilities
- CDN integration for static assets
- Database query optimization
- Microservice-ready architecture

### Monitoring & Observability
- Azure Application Insights integration
- Error tracking and logging
- Performance monitoring
- Health check endpoints

## 🏗️ Infrastructure & Deployment

### Our Actual Implementation

We used **Azure Bicep** templates with **GitHub Actions** for automated infrastructure and application deployment:

#### Azure Services Deployed:
- **Azure App Service (Linux)**: Hosts Node.js backend with ZIP deployment
- **Azure Static Web Apps**: Hosts React frontend with GitHub integration
- **MongoDB Atlas**: Cloud database (external service)
- **Azure Key Vault**: Secure secrets management
- **Azure Application Insights**: Monitoring and telemetry

#### Deployment Process:

1. **Infrastructure Setup**:
   ```bash
   # Create resource group
   az group create --name rg-taskmanager-prod --location eastus

   # Deploy infrastructure using Bicep
   az deployment group create \
     --resource-group rg-taskmanager-prod \
     --template-file infrastructure/main.bicep \
     --parameters infrastructure/parameters.prod.json
   ```

2. **GitHub Actions Setup**:
   - **Backend Workflow**: `.github/workflows/deploy-backend-github.yml`
   - **Frontend Workflow**: `.github/workflows/azure-static-web-apps.yml`

3. **Required GitHub Secrets**:
   ```
   AZURE_CREDENTIALS          # Service principal for Azure authentication
   MONGODB_CONNECTION_STRING   # MongoDB Atlas connection
   JWT_SECRET                 # JWT token secret
   AZURE_STATIC_WEB_APPS_API_TOKEN  # Static Web Apps deployment token
   ```

#### Backend Deployment (ZIP Method):
```bash
# Automated via GitHub Actions on push to main
- Build Node.js application
- Run tests (individual test suites)
- Create deployment ZIP
- Deploy to Azure App Service
- Verify health endpoints
```

#### Frontend Deployment (GitHub Integration):
```bash
# Automated via GitHub Actions on push to main
- Build React application with Vite
- Run frontend tests
- Deploy to Azure Static Web Apps
- Distribute via global CDN
```

## 🔄 CI/CD Pipeline

Our GitHub Actions workflows provide fully automated deployment:

### Backend Workflow (`.github/workflows/deploy-backend-github.yml`)

1. **Trigger**: Push to `main` branch (backend changes)
2. **Test Execution**: Individual test suites to avoid interference
   ```bash
   npm run test:connection    # Database connectivity (3 tests)
   npm run test:utils        # Utility functions (14 tests)
   npm run test:auth         # Authentication (6 tests)
   npm run test:tasks        # Task management (14 tests)
   ```
3. **Build & Package**: Create ZIP deployment package
4. **Deploy**: ZIP deployment to Azure App Service
5. **Verify**: Health check endpoints

### Frontend Workflow (`.github/workflows/azure-static-web-apps.yml`)

1. **Trigger**: Push to `main` branch (frontend changes)
2. **Test Execution**: Frontend test suites
   ```bash
   npm run test:unit         # Component unit tests
   npm run test:integration  # Integration tests
   ```
3. **Build**: Vite production build with optimizations
4. **Deploy**: Automatic deployment to Azure Static Web Apps
5. **CDN**: Global distribution via Azure CDN

### Deployment Commands Used:

**Initial Azure Setup**:
```bash
# Create service principal for GitHub Actions
az ad sp create-for-rbac --name "taskmanager-github-actions" \
  --role "Contributor" \
  --scopes "/subscriptions/{subscription-id}" \
  --sdk-auth

# Create resource group
az group create --name rg-taskmanager-prod --location eastus

# Deploy infrastructure via Bicep
az deployment group create \
  --resource-group rg-taskmanager-prod \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters.prod.json
```

**GitHub Actions Automation**:
- Backend: Automated ZIP deployment on every push
- Frontend: GitHub-integrated deployment with build optimization
- Tests: Individual suite execution to prevent database conflicts
- Monitoring: Application Insights integration for real-time metrics

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests:** API endpoints, middleware, utilities
- **Integration Tests:** Database operations, authentication flow
- **Security Tests:** Input validation, authorization checks

### Frontend Testing
- **Component Tests:** React components rendering and interactions
- **Integration Tests:** User workflows and form submissions
- **E2E Tests:** Complete user journeys (optional)

### Testing Tools
- **Backend:** Jest, Supertest, MongoDB Memory Server
- **Frontend:** Vitest, React Testing Library, jsdom

## 📱 Features

### Core Functionality
- ✅ User registration and authentication
- ✅ Create, read, update, delete tasks
- ✅ Task status management (pending, in-progress, completed)
- ✅ Priority levels (low, medium, high)
- ✅ Due date tracking with overdue indicators
- ✅ Task filtering and sorting
- ✅ Search functionality
- ✅ Dashboard with statistics

### User Experience
- ✅ Responsive design for desktop and mobile
- ✅ Intuitive task management interface
- ✅ Real-time form validation
- ✅ Loading states and error handling
- ✅ Accessibility features (ARIA labels, keyboard navigation)

### Technical Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Database indexing for performance
- ✅ Pagination for large datasets

## 🔧 Detailed Setup & Configuration

### Prerequisites Setup

1. **Node.js Installation**:
   ```bash
   # Download Node.js 20 LTS from https://nodejs.org/
   node --version  # Should show v20.x.x
   npm --version   # Should show 10.x.x or higher
   ```

2. **MongoDB Atlas Setup**:
   ```bash
   # 1. Create account at https://cloud.mongodb.com/
   # 2. Create a new cluster (M0 free tier)
   # 3. Create database user with read/write access
   # 4. Whitelist IP addresses (0.0.0.0/0 for development)
   # 5. Get connection string: mongodb+srv://username:password@cluster.mongodb.net/
   ```

3. **Azure CLI Installation**:
   ```bash
   # macOS
   brew install azure-cli

   # Windows
   # Download from https://aka.ms/installazurecliwindows

   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

   # Verify installation
   az --version
   az login
   ```

### Local Development Setup

1. **Clone and Install Dependencies**:
   ```bash
   # Clone the repository
   git clone https://github.com/GokulAnithaNandakumar/processity-task.git
   cd processity-task

   # Backend setup
   cd backend
   npm install

   # Frontend setup
   cd ../frontend
   npm install
   ```

2. **Environment Configuration**:

   **Backend Environment (`backend/.env`)**:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   MONGODB_TEST_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager_test

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_EXPIRE=7d

   # CORS Configuration
   CLIENT_URL=http://localhost:5173

   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

   **Frontend Environment (`frontend/.env`)**:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:3000/api

   # App Configuration
   VITE_APP_TITLE=Processity Task Manager
   VITE_APP_VERSION=1.0.0
   ```

3. **Database Setup**:
   ```bash
   # Backend database initialization
   cd backend
   npm run dev  # This will create collections automatically

   # Test database setup
   npm test  # This will run tests and verify database connection
   ```

### Running the Application

1. **Development Mode**:
   ```bash
   # Terminal 1: Start Backend
   cd backend
   npm run dev
   # Server runs on http://localhost:3000
   # API available at http://localhost:3000/api

   # Terminal 2: Start Frontend
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

2. **Production Build**:
   ```bash
   # Build Frontend
   cd frontend
   npm run build
   # Creates optimized build in dist/ folder

   # Build Backend (for deployment)
   cd backend
   npm run build  # If build script exists, otherwise files are ready
   ```

### Testing Procedures

1. **Backend Testing**:
   ```bash
   cd backend

   # Run all tests (may have database conflicts)
   npm test

   # Run individual test suites (recommended)
   npm run test:connection  # Database connectivity (3 tests)
   npm run test:utils      # Utility functions (14 tests)
   npm run test:auth       # Authentication flow (6 tests)
   npm run test:tasks      # Task CRUD operations (14 tests)

   # Run tests with coverage
   npm run test:coverage
   ```

2. **Frontend Testing**:
   ```bash
   cd frontend

   # Run all frontend tests
   npm run test

   # Run specific test types
   npm run test:unit        # Component unit tests
   npm run test:integration # Integration tests

   # Run tests with coverage
   npm run test:coverage
   ```

### Technology Stack Details

#### Frontend Technologies
- **React 18.2.0**: Modern UI library with hooks and functional components
- **TypeScript 5.0**: Type-safe JavaScript development
- **Vite 5.0**: Fast build tool and development server
- **React Router 6.8**: Client-side routing and navigation
- **Axios 1.6**: HTTP client for API communication
- **React Hook Form 7.4**: Form handling and validation
- **Vitest 1.0**: Fast testing framework
- **React Testing Library 14.0**: Component testing utilities

#### Backend Technologies
- **Node.js 20 LTS**: JavaScript runtime environment
- **Express.js 4.18**: Web framework for Node.js
- **MongoDB 6.0**: NoSQL document database
- **Mongoose 8.0**: MongoDB object modeling library
- **JWT (jsonwebtoken 9.0)**: Authentication token generation
- **bcryptjs 2.4**: Password hashing library
- **express-validator 7.0**: Input validation middleware
- **helmet 7.1**: Security headers middleware
- **cors 2.8**: Cross-origin resource sharing
- **dotenv 16.3**: Environment variable management
- **Jest 29.7**: Testing framework
- **Supertest 6.3**: HTTP testing library

#### Cloud & Infrastructure
- **Azure App Service**: Backend hosting platform
- **Azure Static Web Apps**: Frontend hosting with CDN
- **MongoDB Atlas**: Cloud database service
- **Azure Key Vault**: Secrets management
- **Azure Application Insights**: Monitoring and telemetry
- **GitHub Actions**: CI/CD automation
- **Azure Bicep**: Infrastructure as Code

### API Endpoints Documentation

#### Authentication Endpoints
```bash
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
GET  /api/auth/me        # Get current user (protected)
```

#### Task Management Endpoints
```bash
GET    /api/tasks        # Get all user tasks (protected)
POST   /api/tasks        # Create new task (protected)
GET    /api/tasks/:id    # Get specific task (protected)
PUT    /api/tasks/:id    # Update task (protected)
DELETE /api/tasks/:id    # Delete task (protected)
```

#### Health Check
```bash
GET /api/health          # API health status
```

### Deployment Configuration

#### Azure App Service (Backend)
- **Runtime**: Node.js 20 LTS
- **Platform**: Linux
- **Deployment**: ZIP file via GitHub Actions
- **Environment Variables**: Configured in Azure portal
- **Scaling**: Auto-scaling enabled
- **Health Check**: `/api/health` endpoint

#### Azure Static Web Apps (Frontend)
- **Build Tool**: Vite
- **Deployment**: GitHub integration
- **CDN**: Global distribution enabled
- **Custom Domain**: Optional configuration
- **Environment Variables**: Build-time configuration

#### MongoDB Atlas
- **Cluster**: M0 (Free tier) or M2+ for production
- **Region**: Same as Azure resources for low latency
- **Security**: IP whitelisting and database authentication
- **Backup**: Automated daily backups
- **Monitoring**: Built-in performance monitoring

### Security Implementation

1. **Authentication Security**:
   - JWT tokens with 7-day expiration
   - bcrypt password hashing with 12 salt rounds
   - Protected route middleware
   - User session validation

2. **API Security**:
   - CORS configuration for specific origins
   - Rate limiting middleware
   - Input validation and sanitization
   - SQL injection prevention via Mongoose
   - XSS protection through proper data handling

3. **Infrastructure Security**:
   - HTTPS enforcement in production
   - Azure Key Vault for secrets
   - Environment variable management
   - Security headers via Helmet.js

### Project Structure
```
processity-task/
├── backend/                 # Node.js Express API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── tests/              # Jest test suites
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── frontend/               # React TypeScript app
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   └── package.json        # Dependencies
├── .github/workflows/      # GitHub Actions CI/CD
├── infrastructure/         # Azure Bicep templates
└── README.md              # Project documentation
```

---

## 📝 Project Summary

This Processity Task Manager is a comprehensive full-stack web application developed as a technical demonstration showcasing:

- **Modern Web Development**: React 18 + TypeScript frontend with Node.js + Express backend
- **Cloud-Native Architecture**: Azure-hosted with microservices-ready design
- **DevOps Practices**: Complete CI/CD pipeline with automated testing and deployment
- **Security Implementation**: JWT authentication, input validation, and secure API design
- **Scalable Infrastructure**: Auto-scaling Azure services with global CDN distribution
- **Quality Assurance**: 38 comprehensive backend tests with individual suite execution

**Live Demo**: The application is deployed and accessible at the URLs provided in the Live Deployment section above.

