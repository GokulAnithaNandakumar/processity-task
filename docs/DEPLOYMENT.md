# Deployment Guide

This guide provides step-by-step instructions for deploying the Task Manager application to Microsoft Azure.

## Prerequisites

Before you begin, ensure you have:

1. **Azure Subscription** - Active Azure subscription
2. **Azure CLI** - Installed and configured
3. **Terraform** - Version 1.0 or higher
4. **Node.js** - Version 18 or higher
5. **Git** - For version control
6. **GitHub Account** - For CI/CD integration

## Quick Deployment

For a quick deployment using the automated pipeline:

1. **Fork the repository** to your GitHub account
2. **Set up secrets** in your GitHub repository
3. **Push to main branch** to trigger deployment

## Manual Deployment

### Step 1: Azure Setup

1. **Login to Azure**
   ```bash
   az login
   ```

2. **Set subscription** (if you have multiple)
   ```bash
   az account set --subscription "your-subscription-id"
   ```

3. **Create service principal** for Terraform
   ```bash
   az ad sp create-for-rbac --name "terraform-sp" --role="Contributor" --scopes="/subscriptions/your-subscription-id"
   ```

   Save the output for later use.

### Step 2: Configure Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/processity-task.git
   cd processity-task
   ```

2. **Configure Terraform variables**
   ```bash
   cd infra
   cp terraform.tfvars.example terraform.tfvars
   ```

   Edit `terraform.tfvars` with your values:
   ```hcl
   app_name             = "your-app-name"
   environment          = "production"
   location            = "East US"
   resource_group_name = "rg-taskmanager-prod"
   ```

### Step 3: Deploy Infrastructure

1. **Initialize Terraform**
   ```bash
   terraform init
   ```

2. **Plan deployment**
   ```bash
   terraform plan -var="jwt_secret=your-secure-jwt-secret"
   ```

3. **Apply infrastructure**
   ```bash
   terraform apply -var="jwt_secret=your-secure-jwt-secret"
   ```

   Type `yes` when prompted.

4. **Note the outputs**
   ```bash
   terraform output
   ```

### Step 4: Deploy Backend

1. **Build backend**
   ```bash
   cd ../backend
   npm ci --only=production
   ```

2. **Create deployment package**
   ```bash
   zip -r backend-deployment.zip . -x "tests/*" "*.test.js" "coverage/*"
   ```

3. **Deploy to Azure App Service**
   ```bash
   az webapp deployment source config-zip \
     --resource-group "your-resource-group" \
     --name "your-app-service-name" \
     --src backend-deployment.zip
   ```

### Step 5: Deploy Frontend

1. **Build frontend**
   ```bash
   cd ../frontend
   npm ci
   npm run build
   ```

2. **Deploy to Azure Static Web Apps**

   Option A: Using Azure CLI
   ```bash
   az staticwebapp create \
     --name "your-static-app-name" \
     --resource-group "your-resource-group" \
     --source "https://github.com/your-username/processity-task" \
     --location "West Europe" \
     --branch "main" \
     --app-location "/frontend" \
     --output-location "dist"
   ```

   Option B: Manual upload through Azure portal

### Step 6: Configure Environment Variables

1. **Backend App Service Settings**
   ```bash
   az webapp config appsettings set \
     --resource-group "your-resource-group" \
     --name "your-app-service-name" \
     --settings \
       NODE_ENV=production \
       MONGODB_URI="your-cosmos-db-connection-string" \
       JWT_SECRET="@Microsoft.KeyVault(VaultName=your-key-vault;SecretName=jwt-secret)"
   ```

2. **Frontend Environment Variables**
   Update the build configuration with your API URL.

## CI/CD Deployment

### GitHub Actions Setup

1. **Add secrets to GitHub repository**

   Go to your repository → Settings → Secrets → Actions, and add:

   - `AZURE_CREDENTIALS`: JSON output from service principal creation
   - `JWT_SECRET`: Your secure JWT secret
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: From Azure Static Web Apps

2. **AZURE_CREDENTIALS format**
   ```json
   {
     "clientId": "client-id",
     "clientSecret": "client-secret",
     "subscriptionId": "subscription-id",
     "tenantId": "tenant-id"
   }
   ```

3. **Trigger deployment**
   ```bash
   git push origin main
   ```

   The GitHub Actions workflow will automatically:
   - Run tests
   - Build applications
   - Deploy infrastructure
   - Deploy backend and frontend

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. **Configure custom domain for Static Web Apps**
   ```bash
   az staticwebapp hostname set \
     --name "your-static-app-name" \
     --resource-group "your-resource-group" \
     --hostname "yourdomain.com"
   ```

2. **Configure SSL certificate**
   Azure Static Web Apps provides free SSL certificates automatically.

### 2. Monitoring Setup

1. **Configure Application Insights**
   The Terraform configuration automatically sets up Application Insights.

2. **Set up alerts**
   ```bash
   az monitor metrics alert create \
     --name "High Error Rate" \
     --resource-group "your-resource-group" \
     --scopes "/subscriptions/your-subscription/resourceGroups/your-rg/providers/Microsoft.Web/sites/your-app" \
     --condition "count exceptions/server > 10" \
     --description "Alert when error rate is high"
   ```

### 3. Security Configuration

1. **Enable managed identity** (already configured in Terraform)
2. **Configure Key Vault access policies** (already configured)
3. **Review security headers** in the application

## Verification

### 1. Test Backend API

```bash
curl -X GET "https://your-app-service.azurewebsites.net/api/health"
```

Expected response:
```json
{
  "status": "success",
  "message": "Task Manager API is running",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### 2. Test Frontend

Visit your Static Web App URL and verify:
- Application loads correctly
- User registration works
- Login functionality works
- Task creation and management works

### 3. Test Integration

1. Register a new user through the frontend
2. Create a task
3. Verify the task appears in the dashboard
4. Test CRUD operations

## Troubleshooting

### Common Issues

1. **Terraform deployment fails**
   - Check Azure credentials
   - Verify subscription permissions
   - Check resource naming conflicts

2. **Backend deployment fails**
   - Check App Service logs: `az webapp log tail`
   - Verify environment variables
   - Check database connection

3. **Frontend deployment fails**
   - Check build logs in GitHub Actions
   - Verify API URL configuration
   - Check Static Web Apps configuration

4. **CORS errors**
   - Verify CORS configuration in backend
   - Check allowed origins
   - Ensure HTTPS in production

### Logs and Monitoring

1. **View App Service logs**
   ```bash
   az webapp log tail --name "your-app-service" --resource-group "your-resource-group"
   ```

2. **View Application Insights**
   - Go to Azure Portal → Application Insights
   - Check Live Metrics
   - Review Failures and Performance

3. **Check Static Web Apps logs**
   - Available in Azure Portal
   - GitHub Actions workflow logs

## Scaling and Performance

### Auto-scaling

1. **Configure App Service auto-scaling**
   ```bash
   az monitor autoscale create \
     --resource-group "your-resource-group" \
     --resource "/subscriptions/your-subscription/resourceGroups/your-rg/providers/Microsoft.Web/serverfarms/your-plan" \
     --min-count 1 \
     --max-count 5 \
     --count 1
   ```

### Performance Optimization

1. **Enable App Service caching**
2. **Configure CDN for static assets**
3. **Optimize database queries**
4. **Implement Redis caching** (optional)

## Maintenance

### Regular Tasks

1. **Update dependencies** regularly
2. **Monitor security vulnerabilities**
3. **Review performance metrics**
4. **Backup critical data**
5. **Test disaster recovery procedures**

### Updates and Rollbacks

1. **Rolling updates** through CI/CD
2. **Blue-green deployments** for zero-downtime
3. **Database migrations** with proper backup

## Cost Optimization

1. **Use appropriate pricing tiers**
2. **Monitor resource usage**
3. **Set up cost alerts**
4. **Review and optimize regularly**

For additional support, refer to the Azure documentation or create an issue in the GitHub repository.
