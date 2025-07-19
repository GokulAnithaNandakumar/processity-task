# 🚀 Complete Azure Deployment Guide

## Step-by-Step Instructions for Deploying Task Manager to Azure

### 📋 Prerequisites Checklist

Before you start, ensure you have:

- [ ] **Azure Account** - Free or paid subscription
- [ ] **Azure CLI** - Installed and working
- [ ] **Terraform** - Version 1.5.0 or later
- [ ] **GitHub Account** - Repository access
- [ ] **Node.js 18+** - For local testing

---

## 🔧 Phase 1: Install Required Tools

### For macOS:
```bash
# Install Azure CLI
brew install azure-cli

# Install Terraform
brew install terraform

# Verify installations
az --version
terraform --version
```

### For Windows:
```powershell
# Using Chocolatey
choco install azure-cli terraform

# Or download from:
# Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
# Terraform: https://www.terraform.io/downloads.html
```

### For Linux (Ubuntu/Debian):
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
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

### Step 2: Create Service Principal for Terraform
```bash
# Create service principal (save the output!)
az ad sp create-for-rbac \
  --name "terraform-taskmanager-$(date +%s)" \
  --role="Contributor" \
  --scopes="/subscriptions/$(az account show --query id -o tsv)"
```

**IMPORTANT:** Save this output! You'll need it for GitHub secrets:
```json
{
  "appId": "your-app-id",           # This is clientId
  "displayName": "terraform-taskmanager-xxx",
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

### Step 1: Setup Terraform Variables
```bash
# Navigate to infrastructure directory
cd infra

# Copy example terraform variables
cp terraform.tfvars.example terraform.tfvars
```

### Step 2: Edit terraform.tfvars
Open `terraform.tfvars` and customize:
```hcl
app_name             = "taskmanager-yourname"  # Make this unique!
environment         = "production"
location            = "East US"               # Or your preferred region
resource_group_name = "rg-taskmanager-prod"
app_service_sku     = "B1"                   # Basic tier
database_name       = "taskmanager"
jwt_secret          = "your-super-secure-256-bit-jwt-secret-here"

tags = {
  Environment = "production"
  Project     = "TaskManager"
  ManagedBy   = "Terraform"
  Owner       = "YourName"
}
```

### Step 3: Initialize and Plan Terraform
```bash
# Initialize Terraform
terraform init

# Plan the deployment (review what will be created)
terraform plan

# If plan looks good, apply it
terraform apply
```

**Expected Resources Created:**
- Resource Group
- App Service Plan
- App Service (for backend)
- Static Web App (for frontend)
- Cosmos DB with MongoDB API
- Key Vault
- Application Insights

### Step 4: Note the Outputs
After successful deployment, note these outputs:
```bash
# Get important URLs
terraform output backend_url
terraform output frontend_url
terraform output cosmos_connection_string
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
1. Run tests
2. Deploy infrastructure
3. Deploy backend to App Service
4. Deploy frontend to Static Web Apps

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
- `MONGODB_URI` (from Cosmos DB)
- `JWT_SECRET` (from Key Vault)
- `CORS_ORIGIN` (frontend URL)

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
# Test Cosmos DB connection
az cosmosdb show --name "taskmanager-yourname-cosmos" --resource-group "rg-taskmanager-prod"

# Check connection string in Key Vault
az keyvault secret show --name "cosmos-connection" --vault-name "taskmanager-yourname-kv"
```

---

## 💰 Cost Estimation

**Monthly costs (approximate):**
- App Service B1: ~$13.14
- Cosmos DB Serverless: ~$1-10 (usage-based)
- Static Web Apps: Free
- Key Vault: ~$3
- Application Insights: Free tier

**Total: ~$17-26 per month**

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
   # Enable Cosmos DB backup
   az cosmosdb backup policy update \
     --account-name "taskmanager-yourname-cosmos" \
     --resource-group "rg-taskmanager-prod" \
     --backup-interval 240 \
     --backup-retention 720
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
