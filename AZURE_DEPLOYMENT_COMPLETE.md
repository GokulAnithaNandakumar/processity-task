# 🚀 Complete Azure Deployment Guide

## Step-by-Step Instructions for Deploying Task Manager to Azure

> **🔧 This guide uses Azure Bicep for Infrastructure as Code (IaC) deployment**
>
> Bicep is Microsoft's domain-specific language for deploying Azure resources. It provides a cleaner syntax than ARM templates and is natively supported by Azure CLI.

### 📋 Prerequisites Checklist

Before you start, ensure you have:

- [ ] **Azure Account** - Free or paid subscription
- [ ] **Azure CLI** - Version 2.50.0 or later (includes Bicep)
- [ ] **GitHub Account** - Repository access
- [ ] **Node.js 20+** - For local development and testing
- [ ] **Git** - For version control

---

## 🔧 Phase 1: Install Required Tools

### For macOS:
```bash
# Install Azure CLI (includes Bicep)
brew install azure-cli

# Verify installations
az --version
az bicep version
```

### Why Bicep over Terraform?

**Azure Bicep Advantages:**
- ✅ **Native Azure Support** - Built and maintained by Microsoft
- ✅ **Simplified Syntax** - Cleaner than ARM templates
- ✅ **No State Management** - Azure Resource Manager handles state
- ✅ **Built-in Validation** - Type safety and IntelliSense support
- ✅ **Day-0 Azure Feature Support** - New Azure features available immediately
- ✅ **No Additional Installation** - Included with Azure CLI

### For Windows:
```powershell
# Using Chocolatey
choco install azure-cli

# Or download from:
# Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
# Bicep is included with Azure CLI
```

### For Linux (Ubuntu/Debian):
```bash
# Install Azure CLI (includes Bicep)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Verify installations
az --version
az bicep version
```

---

## 🔐 Phase 2: Azure Setup & Authentication

### Step 1: Login to Azure
```bash
# Login to Azure (opens browser)
az login

# List your subscriptions
az account list --output table

# Set active subscription (replace with your subscription ID)
az account set --subscription "your-subscription-id"

# Verify current subscription
az account show
```

### Step 2: Create Service Principal for Azure Deployment
```bash
# Create service principal (save the output!)
az ad sp create-for-rbac \
  --name "bicep-taskmanager-$(date +%s)" \
  --role="Contributor" \
  --scopes="/subscriptions/$(az account show --query id -o tsv)"
```

**IMPORTANT:** Save this output! You'll need it for GitHub secrets:
```json
{
  "appId": "your-app-id",           # This is clientId
  "displayName": "bicep-taskmanager-xxx",
  "password": "your-password",      # This is clientSecret
  "tenant": "your-tenant-id"
}
```

### Step 3: Test Service Principal
```bash
# Test login with service principal
az login --service-principal \
  --username "your-app-id" \
  --password "your-password" \
  --tenant "your-tenant-id"
```

---

## 🏗️ Phase 3: Configure Infrastructure

### Step 1: Setup Bicep Parameters
```bash
# Navigate to infrastructure directory
cd infrastructure

# Copy example parameters file
cp parameters.example.json parameters.prod.json
```

### Step 2: Edit parameters.prod.json
Open `parameters.prod.json` and customize:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "appName": {
      "value": "taskmanager-yourname"
    },
    "environment": {
      "value": "production"
    },
    "location": {
      "value": "East US"
    },
    "appServiceSku": {
      "value": "B1"
    },
    "databaseName": {
      "value": "taskmanager"
    },
    "jwtSecret": {
      "value": "your-super-secure-256-bit-jwt-secret-here"
    },
    "tags": {
      "value": {
        "Environment": "production",
        "Project": "TaskManager",
        "ManagedBy": "Bicep",
        "Owner": "YourName"
      }
    }
  }
}
```

### Step 3: Deploy Infrastructure with Bicep
```bash
# Create resource group
az group create \
  --name "rg-taskmanager-prod" \
  --location "East US"

# Validate Bicep template
az deployment group validate \
  --resource-group "rg-taskmanager-prod" \
  --template-file "main.bicep" \
  --parameters "@parameters.prod.json"

# Deploy infrastructure (what-if preview)
az deployment group what-if \
  --resource-group "rg-taskmanager-prod" \
  --template-file "main.bicep" \
  --parameters "@parameters.prod.json"

# If everything looks good, deploy
az deployment group create \
  --resource-group "rg-taskmanager-prod" \
  --template-file "main.bicep" \
  --parameters "@parameters.prod.json" \
  --name "taskmanager-deployment-$(date +%Y%m%d-%H%M%S)"
```

**Expected Resources Created:**
- Resource Group
- App Service Plan (Linux)
- App Service (for Node.js backend)
- Static Web App (for React frontend)
- MongoDB Atlas Database (managed)
- Azure Key Vault (for secrets)
- Application Insights (for monitoring)

### Step 4: Note the Deployment Outputs
After successful deployment, get important information:
```bash
# Get deployment outputs
az deployment group show \
  --resource-group "rg-taskmanager-prod" \
  --name "taskmanager-deployment-latest" \
  --query "properties.outputs"

# Get specific values
az deployment group show \
  --resource-group "rg-taskmanager-prod" \
  --name "taskmanager-deployment-latest" \
  --query "properties.outputs.backendUrl.value" -o tsv

az deployment group show \
  --resource-group "rg-taskmanager-prod" \
  --name "taskmanager-deployment-latest" \
  --query "properties.outputs.frontendUrl.value" -o tsv
```

---

## 🔑 Phase 4: Configure GitHub Secrets

### Step 1: Create AZURE_CREDENTIALS Secret
In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Create secret named `AZURE_CREDENTIALS` with this JSON format:
```json
{
  "clientId": "your-app-id-from-service-principal",
  "clientSecret": "your-password-from-service-principal",
  "subscriptionId": "your-azure-subscription-id",
  "tenantId": "your-tenant-id-from-service-principal"
}
```

### Step 2: Create JWT_SECRET Secret
Create secret named `JWT_SECRET`:
```
your-super-secure-256-bit-jwt-secret-here
```

### Step 3: Get Static Web Apps Token
1. Go to Azure Portal
2. Navigate to your Static Web App resource
3. Go to **Manage deployment token**
4. Copy the token
5. Create GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` with this token

---

## 🚀 Phase 5: Deploy Application

### Method 1: Automatic Deployment (Recommended)
```bash
# Simply push to main branch
git add .
git commit -m "feat: azure deployment configuration"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run tests for frontend and backend
2. Deploy infrastructure using Bicep templates
3. Deploy backend to Azure App Service
4. Deploy frontend to Azure Static Web Apps

### Method 2: Manual Deployment
If you prefer manual deployment:

#### Backend Deployment:
```bash
cd backend

# Build deployment package
npm ci --only=production
zip -r backend-deployment.zip . -x "tests/*" "*.test.js"

# Deploy to App Service
az webapp deploy \
  --resource-group "rg-taskmanager-prod" \
  --name "taskmanager-yourname-api" \
  --src-path backend-deployment.zip
```

#### Frontend Deployment:
```bash
cd frontend

# Set API URL and build
export VITE_API_URL="https://taskmanager-yourname-api.azurewebsites.net/api"
npm ci
npm run build

# Deploy using SWA CLI (install first: npm install -g @azure/static-web-apps-cli)
swa deploy ./dist \
  --deployment-token "your-static-web-apps-token"
```

---

## 🔍 Phase 6: Verification & Testing

### Step 1: Test Backend API
```bash
# Test health endpoint
curl -X GET "https://taskmanager-yourname-api.azurewebsites.net/api/health"

# Should return:
# {
#   "status": "success",
#   "message": "Task Manager API is running",
#   "timestamp": "2025-07-19T..."
# }
```

### Step 2: Test Frontend
1. Open browser to: `https://taskmanager-yourname-frontend.azurestaticapps.net`
2. Try to register a new user
3. Login and create a task
4. Verify everything works

### Step 3: Check Logs
```bash
# Backend logs
az webapp log tail \
  --resource-group "rg-taskmanager-prod" \
  --name "taskmanager-yourname-api"

# Or view in Azure Portal:
# App Services → your-backend-app → Log stream
```

---

## 🛠️ Phase 7: Environment Configuration

### Backend Environment Variables
Your backend will automatically use these Azure App Settings:
- `NODE_ENV=production`
- `MONGODB_URI` (from MongoDB Atlas connection string)
- `JWT_SECRET` (from Azure Key Vault)
- `CORS_ORIGIN` (frontend URL from Static Web Apps)
- `PORT=8080` (default for Azure App Service)

### Frontend Environment Variables
Set these in Static Web Apps configuration:
- `VITE_API_URL=https://taskmanager-yourname-api.azurewebsites.net/api`

---

## 📊 Phase 8: Monitoring & Maintenance

### Application Insights
- View performance metrics in Azure Portal
- Monitor API response times
- Track user interactions

### Cost Monitoring
Set up budget alerts:
```bash
az consumption budget create \
  --budget-name "taskmanager-budget" \
  --amount 50 \
  --time-grain Monthly \
  --category Cost
```

### Scaling Configuration
```bash
# Enable auto-scaling
az appservice plan update \
  --name "taskmanager-yourname-plan" \
  --resource-group "rg-taskmanager-prod" \
  --sku S1  # Upgrade for auto-scaling
```

---

## 🚨 Troubleshooting Common Issues

### Bicep Deployment Issues
```bash
# Validate Bicep template syntax
az bicep build --file infrastructure/main.bicep

# Check for Bicep linting issues
az bicep lint --file infrastructure/main.bicep

# View detailed deployment logs
az deployment group show \
  --resource-group "rg-taskmanager-prod" \
  --name "your-deployment-name" \
  --query "properties.error"
```

### GitHub Actions Failing
```bash
# Check workflow file syntax
yamllint .github/workflows/deploy.yml

# Check if secrets are set correctly
# Go to GitHub repo → Settings → Secrets → Actions
```

### Backend Not Starting
```bash
# Check App Service logs
az webapp log tail --name "taskmanager-yourname-api" --resource-group "rg-taskmanager-prod"

# Check environment variables
az webapp config appsettings list --name "taskmanager-yourname-api" --resource-group "rg-taskmanager-prod"
```

### Frontend Build Failing
```bash
# Check if API URL is set correctly
echo $VITE_API_URL

# Test local build
cd frontend
npm run build
```

### Database Connection Issues
```bash
# Test MongoDB Atlas connection
# Check connection string in Key Vault
az keyvault secret show \
  --name "mongodb-connection-string" \
  --vault-name "taskmanager-yourname-kv"

# Test database connectivity from App Service
az webapp ssh \
  --resource-group "rg-taskmanager-prod" \
  --name "taskmanager-yourname-api"
```

---

## 💰 Cost Estimation

**Monthly costs (approximate):**
- App Service B1 (Linux): ~$13.14
- MongoDB Atlas M0 (Free Tier): $0
- Static Web Apps (Free Tier): $0
- Azure Key Vault: ~$3
- Application Insights (Basic): Free tier

**Total: ~$16-20 per month**

*Note: Costs may vary based on usage and region. MongoDB Atlas M0 provides 512MB storage for free.*

---

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (Optional)
   ```bash
   # Add custom domain to Static Web Apps
   az staticwebapp hostname set \
     --name "taskmanager-yourname-frontend" \
     --hostname "yourdomain.com"
   ```

2. **SSL Certificate** (Automatic with Azure)

3. **Backup Strategy**
   ```bash
   # MongoDB Atlas provides automated backups
   # Configure backup retention in Atlas console
   # Set up point-in-time recovery if needed

   # For App Service, enable backup
   az webapp config backup update \
     --resource-group "rg-taskmanager-prod" \
     --webapp-name "taskmanager-yourname-api" \
     --container-url "your-storage-account-url"
   ```

4. **Monitoring Alerts**
   - Set up health check alerts
   - Configure performance thresholds
   - Set up cost alerts

---

## 📞 Support

If you encounter issues:

1. Check Azure Portal for error messages
2. Review GitHub Actions logs
3. Check Application Insights for runtime errors
4. Verify all secrets are configured correctly

Your Task Manager application should now be live on Azure! 🎉

**URLs:**
- Frontend: `https://taskmanager-yourname-frontend.azurestaticapps.net`
- Backend API: `https://taskmanager-yourname-api.azurewebsites.net/api`
