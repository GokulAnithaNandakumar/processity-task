# 🔐 GitHub Secrets Setup for Auto-Deployment

After running the Azure deployment script, you need to configure these GitHub secrets for automatic deployment:

## Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### 1. AZURE_CREDENTIALS
```json
{
  "clientId": "your-app-id",
  "clientSecret": "your-password",
  "subscriptionId": "ed959e3d-29c2-4f86-b95f-1525af4de229",
  "tenantId": "your-tenant-id"
}
```

**How to get this:**
```bash
az ad sp create-for-rbac --name "github-actions" --role contributor \
  --scopes /subscriptions/ed959e3d-29c2-4f86-b95f-1525af4de229 \
  --sdk-auth
```

### 2. MONGODB_URI
```
mongodb+srv://username:password@cluster.mongodb.net/taskmanager
```

### 3. JWT_SECRET
```
bae500756288df8fcfed406b3e61f5b2e10f4f0628e8c38725da0effca61a11c
```

### 4. AZURE_STATIC_WEB_APPS_API_TOKEN

**How to get this:**
1. Go to Azure Portal
2. Navigate to your Static Web App: `taskmanager-gokul-frontend`
3. Go to "Manage deployment token"
4. Copy the token

## 🚀 Auto-Deployment Flow

Once these secrets are configured:

1. **Push to GitHub main branch** → Triggers deployment
2. **Backend deploys** to `https://taskmanager-gokul-backend.azurewebsites.net`
3. **Frontend deploys** to `https://taskmanager-gokul-frontend.azurestaticapps.net`
4. **Environment variables** are automatically configured
5. **CORS** is automatically set up

## 🔧 Manual Setup (Alternative)

If you prefer to set up Azure credentials manually:

```bash
# Create service principal
az ad sp create-for-rbac --name "github-actions" \
  --role contributor \
  --scopes /subscriptions/ed959e3d-29c2-4f86-b95f-1525af4de229

# Get Static Web Apps token
az staticwebapp secrets list \
  --name "taskmanager-gokul-frontend" \
  --resource-group "rg-taskmanager"
```

## 📱 Testing Your Deployment

After setting up secrets and pushing to GitHub:

1. **Check GitHub Actions**: Go to Actions tab in your repo
2. **Backend API**: Visit `https://taskmanager-gokul-backend.azurewebsites.net/api/health`
3. **Frontend**: Visit `https://taskmanager-gokul-frontend.azurestaticapps.net`

## 🔄 Environment Variables Summary

**Frontend (.env.production):**
- `VITE_API_URL=https://taskmanager-gokul-backend.azurewebsites.net/api`

**Backend (Azure App Settings):**
- `NODE_ENV=production`
- `MONGODB_URI=your-mongodb-connection-string`
- `JWT_SECRET=your-jwt-secret`
- `CORS_ORIGIN=https://taskmanager-gokul-frontend.azurestaticapps.net`

This setup gives you **Vercel-like automatic deployments** with Azure! 🎉
