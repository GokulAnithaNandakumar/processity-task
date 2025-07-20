# Infrastructure as Code - Azure Deployment

This document describes the complete Infrastructure as Code (IaC) setup for the Task Manager application using Azure Bicep templates and GitHub Actions CI/CD.

## 🏗️ **Architecture Overview**

### **Azure Services Used:**

1. **Azure App Service (Linux)** - Hosts the Node.js backend API
   - **Why chosen**: Fully managed platform with built-in scaling, monitoring, and SSL
   - **Scaling**: Auto-scaling based on CPU/memory metrics
   - **Runtime**: Node.js 20 LTS on Linux for optimal performance

2. **Azure Static Web Apps** - Hosts the React frontend
   - **Why chosen**: Global CDN distribution, automatic HTTPS, seamless GitHub integration
   - **Scaling**: Globally distributed, handles traffic spikes automatically
   - **Features**: Built-in authentication, staging environments

3. **Azure Key Vault** - Secure storage for secrets
   - **Why chosen**: Hardware security modules (HSM), audit logging, RBAC
   - **Secrets stored**: MongoDB connection string, JWT secret keys
   - **Security**: System-assigned managed identity for secure access

4. **Azure Monitor + Application Insights** - Monitoring and logging
   - **Why chosen**: Real-time performance monitoring, custom dashboards
   - **Features**: APM, error tracking, performance metrics, log analytics

5. **External: MongoDB Atlas** - Database service
   - **Why chosen**: Managed MongoDB with global clusters, automatic scaling
   - **Benefits**: Built-in security, automated backups, performance optimization

## 🚀 **Deployment Process**

### **Infrastructure as Code (Bicep)**
- All infrastructure defined in `infrastructure/main.bicep`
- Environment-specific parameters in `infrastructure/parameters.prod.json`
- Version controlled and reproducible deployments

### **CI/CD Pipeline Stages:**

1. **Validation**
   - Bicep template validation
   - What-if analysis to preview changes
   - Security and compliance checks

2. **Testing**
   - Backend API linting and unit tests
   - Frontend build verification
   - Code quality gates

3. **Infrastructure Deployment**
   - Creates/updates Azure resources using Bicep
   - Configures networking, security, and monitoring
   - Outputs deployment URLs and configuration

4. **Application Deployment**
   - Backend: ZIP deployment to App Service
   - Frontend: Automatic deployment via Static Web Apps
   - Health checks and verification

## 🔧 **Setup Instructions**

### **Prerequisites:**
- Azure subscription with appropriate permissions
- GitHub repository with Actions enabled
- MongoDB Atlas database

### **1. Create Azure Service Principal**
```bash
# Create service principal for GitHub Actions
az ad sp create-for-rbac --name "taskmanager-github-actions" \
  --role "Contributor" \
  --scopes "/subscriptions/{subscription-id}" \
  --sdk-auth
```

### **2. Configure GitHub Secrets**
Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

```
AZURE_CREDENTIALS
{
  "clientId": "xxx",
  "clientSecret": "xxx",
  "subscriptionId": "xxx",
  "tenantId": "xxx"
}

MONGODB_CONNECTION_STRING
mongodb+srv://username:password@cluster.mongodb.net/taskmanager

JWT_SECRET
your-secure-jwt-secret-key

GITHUB_TOKEN
ghp_your-github-personal-access-token
```

### **3. Deploy Infrastructure**
```bash
# Deploy using Azure CLI
az deployment group create \
  --resource-group rg-taskmanager-prod \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters.prod.json

# Or push to main branch to trigger CI/CD
git push origin main
```

## 🌐 **Environment Configuration**

### **Production Environment:**
- **Resource Group**: `rg-taskmanager-prod`
- **Region**: East US (primary), with CDN global distribution
- **SSL/TLS**: Automatically managed and renewed
- **Monitoring**: 24/7 with alerts and dashboards

### **Environment Variables:**
- **Local Development**: Uses `.env` files
- **Production**: Uses Azure App Settings with Key Vault references
- **Security**: No secrets in code or configuration files

## 📊 **Monitoring and Scaling**

### **Application Insights Integration:**
- Real-time performance monitoring
- Custom telemetry and logging
- Error tracking and alerting
- User behavior analytics

### **Scaling Configuration:**
- **App Service**: Auto-scale rules based on CPU/memory
- **Static Web Apps**: Global CDN with automatic scaling
- **Database**: MongoDB Atlas auto-scaling enabled

### **Performance Optimization:**
- **Frontend**: Build optimization, code splitting, CDN caching
- **Backend**: Connection pooling, async operations, caching
- **Database**: Indexes, connection pooling, read replicas

## 🔒 **Security Features**

### **Identity and Access:**
- Managed Identity for Azure services communication
- Key Vault for secure secret storage
- RBAC (Role-Based Access Control) implementation

### **Network Security:**
- HTTPS enforcement across all endpoints
- CORS configuration for secure cross-origin requests
- Private endpoints for sensitive resources

### **Compliance:**
- Audit logging enabled
- Data encryption at rest and in transit
- Regular security updates and patches

## 🚨 **Monitoring and Alerts**

### **Health Checks:**
- Backend API health endpoint: `/api/health`
- Automated monitoring with Application Insights
- Custom alerts for performance degradation

### **Logging:**
- Centralized logging with Log Analytics
- Error tracking and performance metrics
- Custom dashboards and reports

## 📈 **Cost Optimization**

### **Resource Sizing:**
- **Production**: B1 App Service Plan (optimized for production workloads)
- **Development**: F1 Free tier for testing
- **Monitoring**: Pay-per-use model with data retention policies

### **Scaling Strategy:**
- Horizontal scaling for high availability
- Auto-shutdown for non-production environments
- Resource tagging for cost allocation

## 🔄 **Future Enhancements**

### **Containerization:**
- Docker containers for consistent deployments
- Azure Container Apps for microservices architecture
- Kubernetes orchestration for complex workloads

### **Advanced Features:**
- Blue-green deployments
- A/B testing capabilities
- Multi-region disaster recovery
- Advanced security scanning

## 📝 **Documentation Links**

- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Infrastructure Version**: 1.0
**Last Updated**: July 2025
**Maintained By**: Development Team
