# Processity Task Manager

A comprehensive cloud-based task management application built with modern web technologies and deployed on Azure with full CI/CD automation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Azure](https://img.shields.io/badge/Azure-Cloud-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

## 🌐 Live Deployment

- **Frontend (React)**: [https://brave-ground-0123456789.1.azurestaticapps.net](https://brave-ground-0123456789.1.azurestaticapps.net)
- **Backend API**: [https://processity-task-backend.azurewebsites.net](https://processity-task-backend.azurewebsites.net)
- **API Health Check**: [https://processity-task-backend.azurewebsites.net/api/health](https://processity-task-backend.azurewebsites.net/api/health)

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
- Node.js 18 or higher
- npm or yarn
- MongoDB (local) or Azure Cosmos DB
- Azure CLI (for deployment)
- Terraform (for infrastructure)

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

## 🔧 Configuration

### Environment-Specific Settings

**Development:**
- Local MongoDB instance
- Debug logging enabled
- CORS allows localhost
- Hot reloading enabled

**Production:**
- Azure Cosmos DB
- Structured logging
- CORS restricted to production domains
- Performance optimizations enabled

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time updates with WebSockets
- [ ] Team collaboration features
- [ ] File attachments for tasks
- [ ] Advanced reporting and analytics
- [ ] Mobile application (React Native)
- [ ] Integration with calendar applications
- [ ] Notification system (email/push)

### Technical Improvements
- [ ] Redis caching layer
- [ ] Container deployment with Docker
- [ ] Kubernetes orchestration
- [ ] Advanced monitoring and alerting
- [ ] A/B testing framework
- [ ] Performance testing suite

## 🐛 Known Issues & Limitations

- Search functionality is currently client-side only
- File uploads not yet implemented
- Limited to single-user tasks (no sharing)
- Basic notification system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** Gokul Anitha Nandakumar
- **Email:** [your-email@example.com]
- **LinkedIn:** [Your LinkedIn Profile]

## 🙏 Acknowledgments

- Microsoft Azure for cloud infrastructure
- Open source community for excellent tools and libraries
- Processity for the challenging project requirements

---

**Built with ❤️ using modern web technologies and cloud-native practices.**

