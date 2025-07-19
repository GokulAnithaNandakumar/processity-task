# # Task Manager Application

A full-stack cloud-based task management application built with modern technologies and deployed on Microsoft Azure.

## 🚀 Live Demo

- **Frontend:** [https://taskmanager-frontend.azurestaticapps.net](https://taskmanager-frontend.azurestaticapps.net)
- **Backend API:** [https://taskmanager-api.azurewebsites.net](https://taskmanager-api.azurewebsites.net)

## 📋 Overview

This is a comprehensive task management application that allows users to create, view, update, and delete personal tasks with rich metadata including title, description, due date, status, and priority levels. The application demonstrates modern full-stack development practices with a focus on security, performance, and scalability.

## 🏗️ Architecture

The application follows a modern three-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Azure Static  │    │   Azure App     │    │   Azure Cosmos  │
│   Web Apps      │    │   Service       │    │   DB            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components:
- **Frontend:** React with TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js with Express, MongoDB/Mongoose
- **Database:** Azure Cosmos DB (MongoDB API)
- **Authentication:** JWT-based authentication
- **Infrastructure:** Azure App Service, Static Web Apps, Key Vault
- **CI/CD:** GitHub Actions
- **IaC:** Terraform

## 🛠️ Technologies Used

### Frontend
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
- **Azure App Service** for backend hosting
- **Azure Static Web Apps** for frontend hosting
- **Azure Cosmos DB** for database
- **Azure Key Vault** for secrets management
- **Azure Application Insights** for monitoring
- **Terraform** for Infrastructure as Code
- **GitHub Actions** for CI/CD

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
   # Edit .env with your configuration
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Environment Variables**

   Backend (.env):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

   Frontend (.env):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm run test
```

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

## 🏗️ Infrastructure as Code

The infrastructure is defined using Terraform and includes:

- **Resource Group** for organizing resources
- **App Service Plan** for hosting the backend
- **Azure App Service** for the Node.js API
- **Azure Static Web Apps** for the React frontend
- **Azure Cosmos DB** with MongoDB API
- **Azure Key Vault** for secrets management
- **Application Insights** for monitoring

### Deployment

1. **Prerequisites**
   ```bash
   # Install Azure CLI
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

   # Install Terraform
   wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt update && sudo apt install terraform
   ```

2. **Azure Login**
   ```bash
   az login
   ```

3. **Deploy Infrastructure**
   ```bash
   cd infra
   terraform init
   terraform plan
   terraform apply
   ```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Code Quality Checks**
   - Linting for both frontend and backend
   - TypeScript compilation
   - Dependency vulnerability scanning

2. **Testing**
   - Unit tests for backend API
   - Component tests for frontend
   - Integration tests for critical paths

3. **Build**
   - Backend application packaging
   - Frontend production build
   - Asset optimization

4. **Infrastructure Deployment**
   - Terraform plan and apply
   - Infrastructure validation

5. **Application Deployment**
   - Backend deployment to Azure App Service
   - Frontend deployment to Azure Static Web Apps
   - Environment-specific configuration

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

