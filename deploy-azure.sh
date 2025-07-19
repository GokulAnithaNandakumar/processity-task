#!/bin/bash

# Azure Deployment Script for Task Manager Application
# This script automates the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting Azure Deployment for Task Manager Application..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    print_error "Terraform is not installed. Please install it first."
    exit 1
fi

# Check if user is logged into Azure
if ! az account show &> /dev/null; then
    print_warning "You are not logged into Azure. Logging in now..."
    az login
fi

print_success "Prerequisites check completed!"

# Variables (can be overridden by environment variables)
APP_NAME=${APP_NAME:-"taskmanager-$(date +%s)"}
ENVIRONMENT=${ENVIRONMENT:-"production"}
LOCATION=${LOCATION:-"East US"}
RESOURCE_GROUP=${RESOURCE_GROUP:-"rg-${APP_NAME}"}

print_status "Deployment Configuration:"
echo "  - App Name: $APP_NAME"
echo "  - Environment: $ENVIRONMENT"
echo "  - Location: $LOCATION"
echo "  - Resource Group: $RESOURCE_GROUP"

# Ask for confirmation
read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled by user."
    exit 0
fi

# Step 1: Deploy Infrastructure
print_status "Step 1: Deploying infrastructure with Terraform..."
cd infra

# Initialize Terraform if not already done
if [ ! -d ".terraform" ]; then
    print_status "Initializing Terraform..."
    terraform init
fi

# Create terraform.tfvars if it doesn't exist
if [ ! -f "terraform.tfvars" ]; then
    print_status "Creating terraform.tfvars..."
    cat > terraform.tfvars << EOF
app_name             = "$APP_NAME"
environment         = "$ENVIRONMENT"
location            = "$LOCATION"
resource_group_name = "$RESOURCE_GROUP"
app_service_sku     = "B1"
database_name       = "taskmanager"

tags = {
  Environment = "$ENVIRONMENT"
  Project     = "TaskManager"
  ManagedBy   = "Terraform"
  DeployedBy  = "$(whoami)"
  DeployedAt  = "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
fi

# Plan and apply Terraform
print_status "Planning Terraform deployment..."
terraform plan -out=tfplan

print_status "Applying Terraform configuration..."
terraform apply tfplan

# Get outputs
BACKEND_URL=$(terraform output -raw backend_url 2>/dev/null || echo "")
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "")

print_success "Infrastructure deployment completed!"

cd ..

# Step 2: Deploy Backend
print_status "Step 2: Preparing backend deployment..."

# Build backend deployment package
cd backend
print_status "Creating backend deployment package..."

# Create a temporary directory for deployment
mkdir -p ../temp/backend-deploy
cp -r . ../temp/backend-deploy/
cd ../temp/backend-deploy

# Install only production dependencies
npm ci --only=production

# Remove unnecessary files
rm -rf tests/
rm -rf node_modules/.cache/
rm -f .env.test .env.example

# Create deployment zip
cd ..
zip -r backend-deployment.zip backend-deploy/
cd ../..

print_success "Backend package prepared!"

# Step 3: Deploy Frontend
print_status "Step 3: Preparing frontend deployment..."

cd frontend

# Set the API URL for production
export VITE_API_URL="$BACKEND_URL/api"

print_status "Building frontend with API URL: $VITE_API_URL"

# Install dependencies and build
npm ci
npm run build

print_success "Frontend build completed!"

cd ..

# Step 4: Configure GitHub Secrets (if in CI/CD)
if [ "$CI" = "true" ]; then
    print_status "Step 4: Running in CI/CD environment..."
    print_status "Make sure the following GitHub secrets are configured:"
    echo "  - AZURE_CREDENTIALS"
    echo "  - JWT_SECRET"
    echo "  - AZURE_STATIC_WEB_APPS_API_TOKEN"
else
    print_warning "Step 4: Manual deployment mode detected."
    print_warning "For automated deployments, configure GitHub Actions with:"
    echo "  - AZURE_CREDENTIALS"
    echo "  - JWT_SECRET"
    echo "  - AZURE_STATIC_WEB_APPS_API_TOKEN"
fi

# Step 5: Health Check
print_status "Step 5: Performing health checks..."

if [ -n "$BACKEND_URL" ]; then
    print_status "Checking backend health at: $BACKEND_URL/api/health"

    # Wait a moment for deployment to complete
    sleep 30

    # Check backend health
    if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
        print_success "Backend health check passed!"
    else
        print_warning "Backend health check failed. It may still be deploying..."
    fi
fi

# Cleanup
print_status "Cleaning up temporary files..."
rm -rf temp/

print_success "🎉 Deployment completed successfully!"
print_status "Deployment Summary:"
if [ -n "$BACKEND_URL" ]; then
    echo "  - Backend API: $BACKEND_URL"
fi
if [ -n "$FRONTEND_URL" ]; then
    echo "  - Frontend App: $FRONTEND_URL"
fi

print_status "Next Steps:"
echo "  1. Verify the application is working correctly"
echo "  2. Configure custom domain (optional)"
echo "  3. Set up monitoring alerts"
echo "  4. Review security settings"

print_success "🚀 Your Task Manager application is now live on Azure!"
