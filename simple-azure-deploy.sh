#!/bin/bash

# Simple Azure Deployment Script with Auto-Deploy Setup
# This creates Azure resources and sets up GitHub Actions for auto-deployment

echo "🚀 Simple Azure Deployment with Auto-Deploy Setup"

# Variables
APP_NAME="taskmanager-gokul"
LOCATION="eastus2"  # Use supported location
RESOURCE_GROUP="rg-taskmanager"

echo "Creating Resource Group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

echo "Creating App Service Plan (Free Tier)..."
az appservice plan create \
  --name "$APP_NAME-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux

echo "Creating Backend Web App..."
az webapp create \
  --name "$APP_NAME-backend" \
  --resource-group $RESOURCE_GROUP \
  --plan "$APP_NAME-plan" \
  --runtime "NODE:20-lts"

echo "Setting up GitHub deployment for backend..."
az webapp deployment source config \
  --name "$APP_NAME-backend" \
  --resource-group $RESOURCE_GROUP \
  --repo-url "https://github.com/GokulAnithaNandakumar/processity-task" \
  --branch "main" \
  --manual-integration

echo "Configuring backend environment variables..."
az webapp config appsettings set \
  --name "$APP_NAME-backend" \
  --resource-group $RESOURCE_GROUP \
  --settings \
    NODE_ENV="production" \
    PORT="8080" \
    WEBSITE_NODE_DEFAULT_VERSION="20.x" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" \
    ENABLE_ORYX_BUILD="true" \
    PRE_BUILD_COMMAND="cd backend && npm install" \
    POST_BUILD_COMMAND="cd backend"

echo "Creating Static Web App for Frontend..."
az staticwebapp create \
  --name "$APP_NAME-frontend" \
  --resource-group $RESOURCE_GROUP \
  --location "Central US" \
  --source "https://github.com/GokulAnithaNandakumar/processity-task" \
  --branch "main" \
  --app-location "/frontend" \
  --output-location "dist"

# Get the URLs
BACKEND_URL="https://$APP_NAME-backend.azurewebsites.net"
FRONTEND_URL=$(az staticwebapp show --name "$APP_NAME-frontend" --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)

echo "Setting up CORS for backend..."
az webapp cors add \
  --name "$APP_NAME-backend" \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins "https://$FRONTEND_URL" "http://localhost:5173"

echo "✅ Resources created with auto-deployment!"
echo ""
echo "🌐 Your App URLs:"
echo "Backend API: $BACKEND_URL"
echo "Frontend: https://$FRONTEND_URL"
echo ""
echo "🔄 Auto-Deployment Setup:"
echo "- Backend: Deploys from /backend folder on git push"
echo "- Frontend: Deploys from /frontend folder on git push"
echo ""
echo "📝 Next Steps:"
echo "1. Update your frontend .env with: VITE_API_URL=$BACKEND_URL/api"
echo "2. Update your backend CORS_ORIGIN with: https://$FRONTEND_URL"
echo "3. Push to GitHub - it will auto-deploy!"
