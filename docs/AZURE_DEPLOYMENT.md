# 🚀 Azure Deployment Guide

This guide provides step-by-step instructions for deploying the Task Manager application to Microsoft Azure using Infrastructure as Code (IaC) and CI/CD best practices.

## 📋 Prerequisites

### Required Tools
1. **Azure CLI** - For Azure authentication and resource management
2. **Terraform** - For Infrastructure as Code (IaC)
3. **Node.js 18+** - For application runtime
4. **Git** - For version control

### Install Prerequisites (macOS)
```bash
# Install Azure CLI and Terraform
brew install azure-cli terraform

# Verify installations
az --version
terraform --version
```

### Install Prerequisites (Windows)
```powershell
# Install using Chocolatey
choco install azure-cli terraform

# Or download from official websites:
# Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
# Terraform: https://www.terraform.io/downloads.html
```

## 🔐 Azure Setup

### 1. Login to Azure
```bash
az login
```

### 2. Set Active Subscription
```bash
# List available subscriptions
az account list --output table

# Set active subscription
az account set --subscription "Your-Subscription-ID"
```

### 3. Create Service Principal for Terraform
```bash
az ad sp create-for-rbac \
  --name "terraform-taskmanager" \
  --role="Contributor" \
  --scopes="/subscriptions/YOUR-SUBSCRIPTION-ID"
```

Save the output - you'll need these values for GitHub secrets:
- `appId` (client_id)
- `password` (client_secret)
- `tenant` (tenant_id)

## 🏗️ Infrastructure Deployment

### 1. Configure Terraform Variables
```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
app_name             = "taskmanager-prod"
environment         = "production"
location            = "East US"
resource_group_name = "rg-taskmanager-prod"
app_service_sku     = "B1"  # Basic tier for cost optimization
database_name       = "taskmanager"
jwt_secret          = "your-super-secure-jwt-secret-here"

tags = {
  Environment = "production"
  Project     = "TaskManager"
  ManagedBy   = "Terraform"
  Owner       = "YourName"
}
```

### 2. Initialize and Deploy Infrastructure
```bash
# Initialize Terraform
terraform init

# Plan deployment (review changes)
terraform plan

# Apply infrastructure
terraform apply
```

### 3. Note the Outputs
After deployment, Terraform will output important values:
- Backend App Service URL
- Frontend Static Web App URL
- Database connection details

## 🔒 Secrets Management

### GitHub Secrets Configuration
Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

```
AZURE_CREDENTIALS={
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}

AZURE_BACKEND_APP_NAME=taskmanager-prod-api
AZURE_BACKEND_PUBLISH_PROFILE=<get-from-azure-portal>
AZURE_STATIC_WEB_APPS_API_TOKEN=<get-from-azure-portal>
JWT_SECRET=your-super-secure-jwt-secret-here
VITE_API_URL=https://taskmanager-prod-api.azurewebsites.net/api
```

### Get Publish Profiles
1. **Backend App Service**:
   - Go to Azure Portal > App Services > your-backend-app
   - Click "Get publish profile"
   - Copy entire XML content to `AZURE_BACKEND_PUBLISH_PROFILE`

2. **Static Web Apps**:
   - Go to Azure Portal > Static Web Apps > your-frontend-app
   - Click "Manage deployment token"
   - Copy token to `AZURE_STATIC_WEB_APPS_API_TOKEN`

## 🚀 Deployment Process

### Automatic Deployment (Recommended)
The CI/CD pipeline automatically deploys when you push to main:

```bash
git add .
git commit -m "feat: deploy to azure"
git push origin main
```

### Manual Deployment

#### Backend Deployment
```bash
cd backend
npm ci --only=production
zip -r deployment.zip . -x "tests/*" "*.test.js" "coverage/*"

az webapp deployment source config-zip \
  --resource-group rg-taskmanager-prod \
  --name taskmanager-prod-api \
  --src deployment.zip
```

#### Frontend Deployment
```bash
cd frontend
npm ci
npm run build

# Deploy using Azure Static Web Apps CLI
npx @azure/static-web-apps-cli deploy \
  --app-location ./dist \
  --deployment-token $AZURE_STATIC_WEB_APPS_API_TOKEN
```

## 🔍 Monitoring and Troubleshooting

### View Application Logs
```bash
# Backend logs
az webapp log tail --resource-group rg-taskmanager-prod --name taskmanager-prod-api

# Download logs
az webapp log download --resource-group rg-taskmanager-prod --name taskmanager-prod-api
```

### Health Checks
- **Backend Health**: `https://your-app-api.azurewebsites.net/api/health`
- **Frontend**: Access the Static Web App URL
- **Database**: Check Azure Cosmos DB metrics in portal

### Common Issues and Solutions

1. **CORS Errors**:
   - Verify frontend URL is in backend CORS settings
   - Check `server.js` CORS configuration

2. **Database Connection Issues**:
   - Verify Cosmos DB connection string in App Settings
   - Check network access rules

3. **Authentication Failures**:
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings

## 🏛️ Architecture Overview

### Azure Services Used

1. **Azure App Service (Linux)** - Backend API hosting
   - Node.js 18 runtime
   - Auto-scaling capabilities
   - Built-in load balancing

2. **Azure Static Web Apps** - Frontend hosting
   - Global CDN distribution
   - Custom domain support
   - Automatic HTTPS

3. **Azure Cosmos DB (MongoDB API)** - Database
   - Global distribution
   - Automatic scaling
   - 99.99% availability SLA

4. **Azure Key Vault** - Secrets management
   - Secure storage for JWT secrets
   - Managed identities integration

5. **Azure Monitor** - Application insights
   - Performance monitoring
   - Error tracking
   - Custom dashboards

### Cost Optimization

- **App Service**: B1 Basic tier ($13/month)
- **Static Web Apps**: Free tier (sufficient for small apps)
- **Cosmos DB**: Provisioned throughput (400 RU/s ~$25/month)
- **Key Vault**: Pay per operation (~$1/month)

**Total estimated cost**: ~$40/month

### Scaling Considerations

1. **Horizontal Scaling**: App Service can scale out to multiple instances
2. **Database Scaling**: Cosmos DB auto-scales based on demand
3. **CDN**: Static Web Apps provides global distribution
4. **Monitoring**: Application Insights tracks performance metrics

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

## 🆘 Support

For deployment issues:
1. Check GitHub Actions logs
2. Review Azure App Service logs
3. Verify all secrets are configured correctly
4. Ensure resource group permissions are correct

## 🔄 Cleanup

To remove all Azure resources:
```bash
cd infra
terraform destroy
```

⚠️ **Warning**: This will permanently delete all resources and data!
