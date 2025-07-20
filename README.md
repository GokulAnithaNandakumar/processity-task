# Processity Task Manager

A comprehensive cloud-based task management application built with modern web technologies and deployed on Azure with full CI/CD automation.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Azure](https://img.shields.io/badge/Azure-Cloud-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

## 🌐 Live Deployment

- **Frontend (React)**: [https://jolly-desert-0d7a9d110.1.azurestaticapps.net](https://jolly-desert-0d7a9d110.1.azurestaticapps.net)
- **Backend API**: [https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net](https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net)
- **API Health Check**: [https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net/api/health](https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net/api/health)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Frontend Implementation](#-frontend-implementation)
- [Backend Implementation](#-backend-implementation)
- [Testing Strategy](#-testing-strategy)
- [Infrastructure & Deployment](#-infrastructure--deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Monitoring & Logging](#-monitoring--logging)
- [Development Workflow](#-development-workflow)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🎯 Project Overview

Processity Task Manager is a full-stack web application that demonstrates modern software architecture, cloud deployment, and DevOps practices. The application allows users to create, manage, and track personal tasks with a focus on security, scalability, and user experience.

### Key Features

- ✅ **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- 📝 **Task Management**: Complete CRUD operations for tasks (Create, Read, Update, Delete)
- 🔒 **Security**: Protected routes, input validation, and secure API endpoints
- ☁️ **Cloud Deployment**: Azure-hosted with auto-scaling and global distribution
- 🚀 **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions
- 📊 **Monitoring**: Application Insights integration with real-time metrics
- 🧪 **Comprehensive Testing**: 38 backend tests + frontend test coverage
- 📱 **PWA Ready**: Progressive Web App features with custom favicon

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Node.js API    │    │  MongoDB Atlas  │
│ (Static Web App)│◄──►│  (App Service)   │◄──►│   (Database)    │
│  Port: 5173     │    │   Port: 3000     │    │   Cloud Hosted  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Azure Static    │    │ Azure App Service│    │ MongoDB Atlas   │
│ Web Apps        │    │ Linux + Node.js  │    │ M0 Cluster      │
│ Global CDN      │    │ Auto-scaling     │    │ Auto-backup     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Azure Infrastructure

- **Frontend**: Azure Static Web Apps with global CDN
- **Backend**: Azure App Service (Linux) with Node.js runtime
- **Database**: MongoDB Atlas cloud database
- **Secrets**: Azure Key Vault for secure configuration
- **Monitoring**: Application Insights for telemetry and logs
- **CI/CD**: GitHub Actions for automated deployment

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS3 with modern responsive design
- **PWA**: Service Worker ready with manifest.json

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js for RESTful API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Testing**: Jest with Supertest for API testing
- **Validation**: Express-validator for input sanitization

### Infrastructure
- **Cloud Provider**: Microsoft Azure
- **IaC**: Azure Bicep templates for infrastructure as code
- **CI/CD**: GitHub Actions with automated workflows
- **Deployment**: ZIP deployment for backend, GitHub integration for frontend
- **Monitoring**: Azure Application Insights
- **Security**: Azure Key Vault for secrets management
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

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- MongoDB Atlas account
- Azure CLI (for deployment)
- Git for version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/GokulAnithaNandakumar/processity-task.git
   cd processity-task
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   npm run dev  # Starts on port 3000
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with backend API URL
   npm run dev  # Starts on port 5173
   ```

4. **Environment Variables**

   Backend (.env):
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   CLIENT_URL=http://localhost:5173
   ```

   Frontend (.env):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Cloud Deployment (How We Actually Did It)

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

**Built with ❤️ using modern web technologies and cloud-native practices for Processity.**

