# 🚀 Azure Deployment Files

This directory contains everything you need to deploy the Task Manager application to Microsoft Azure.

## 📁 Files Overview

- **`AZURE_DEPLOYMENT_COMPLETE.md`** - Comprehensive step-by-step deployment guide
- **`deployment-checklist.md`** - Quick checklist for deployment requirements
- **`quick-deploy.sh`** - Automated deployment script (recommended for beginners)
- **`deploy-azure.sh`** - Advanced deployment script with more options

## 🎯 Quick Start (Recommended)

### For First-Time Deployment:

1. **Install Prerequisites:**
   ```bash
   # macOS
   brew install azure-cli terraform

   # Windows (with Chocolatey)
   choco install azure-cli terraform
   ```

2. **Run Quick Deploy Script:**
   ```bash
   ./quick-deploy.sh
   ```

   This script will:
   - Check prerequisites
   - Login to Azure
   - Create service principal
   - Deploy infrastructure
   - Provide GitHub secrets configuration

3. **Configure GitHub Secrets:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add the secrets provided by the script

4. **Deploy Application:**
   ```bash
   git add .
   git commit -m "feat: azure deployment setup"
   git push origin main
   ```

## 📋 Manual Deployment

If you prefer step-by-step manual deployment, follow the complete guide in `AZURE_DEPLOYMENT_COMPLETE.md`.

## 🛠️ Troubleshooting

### GitHub Actions Failing?
- Check if all required secrets are configured
- Verify Azure credentials are correct
- Check workflow logs in GitHub Actions tab

### Local Script Issues?
```bash
# Make scripts executable
chmod +x *.sh

# Check if you have required tools
az --version
terraform --version
```

### Need Help?
1. Check `AZURE_DEPLOYMENT_COMPLETE.md` for detailed troubleshooting
2. Review Azure Portal for error messages
3. Check GitHub Actions logs

## 📊 Expected Costs

**Monthly Azure costs (approximate):**
- App Service B1: ~$13
- Cosmos DB Serverless: ~$1-10 (usage-based)
- Static Web Apps: Free
- Key Vault: ~$3
- **Total: ~$17-26/month**

## 🎉 What Gets Deployed

Your deployment will create:
- ✅ Backend API on Azure App Service
- ✅ Frontend on Azure Static Web Apps
- ✅ MongoDB-compatible database (Cosmos DB)
- ✅ Secure secrets management (Key Vault)
- ✅ Monitoring and logging (Application Insights)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ HTTPS and custom domain support

Ready to deploy? Start with `./quick-deploy.sh`! 🚀
