#!/bin/bash

# Quick Azure Deployment Script for Task Manager
# Run this script to deploy your application to Azure

set -e

echo "🚀 Task Manager Azure Deployment Script"
echo "========================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running on Windows (Git Bash/WSL)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    print_warning "Detected Windows environment. Make sure you're using Git Bash or WSL."
fi

print_status "Step 1: Checking prerequisites..."

# Check Azure CLI
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not found!"
    echo "Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check Terraform
if ! command -v terraform &> /dev/null; then
    print_error "Terraform not found!"
    echo "Install it from: https://www.terraform.io/downloads.html"
    exit 1
fi

print_success "Prerequisites check passed!"

# Check Azure login
print_status "Step 2: Checking Azure authentication..."
if ! az account show &> /dev/null; then
    print_warning "Not logged into Azure. Please login..."
    az login
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
print_success "Connected to Azure subscription: $SUBSCRIPTION_ID"

# Get user input for app name
print_status "Step 3: Configuration setup..."
read -p "Enter your app name (must be globally unique): " APP_NAME
if [[ -z "$APP_NAME" ]]; then
    print_error "App name cannot be empty!"
    exit 1
fi

# Validate app name
if [[ ! "$APP_NAME" =~ ^[a-z0-9-]+$ ]]; then
    print_error "App name can only contain lowercase letters, numbers, and hyphens!"
    exit 1
fi

print_status "App name: $APP_NAME"

# Create service principal
print_status "Step 4: Creating service principal for Terraform..."
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "terraform-$APP_NAME-$(date +%s)" \
    --role="Contributor" \
    --scopes="/subscriptions/$SUBSCRIPTION_ID" \
    --output json)

CLIENT_ID=$(echo $SP_OUTPUT | jq -r '.appId')
CLIENT_SECRET=$(echo $SP_OUTPUT | jq -r '.password')
TENANT_ID=$(echo $SP_OUTPUT | jq -r '.tenant')

print_success "Service principal created!"

# Create terraform.tfvars
print_status "Step 5: Creating Terraform configuration..."
cd infra

cat > terraform.tfvars << EOF
app_name             = "$APP_NAME"
environment         = "production"
location            = "East US"
resource_group_name = "rg-$APP_NAME-prod"
app_service_sku     = "B1"
database_name       = "taskmanager"
jwt_secret          = "$(openssl rand -hex 32)"

tags = {
  Environment = "production"
  Project     = "TaskManager"
  ManagedBy   = "Terraform"
  DeployedBy  = "$(whoami)"
  DeployedAt  = "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

print_success "Terraform variables created!"

# Initialize and apply Terraform
print_status "Step 6: Deploying infrastructure..."
terraform init

print_status "Planning Terraform deployment..."
terraform plan

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled."
    exit 0
fi

terraform apply -auto-approve

# Get outputs
BACKEND_URL=$(terraform output -raw backend_url 2>/dev/null || echo "")
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "")
SWA_TOKEN=$(terraform output -raw swa_deployment_token 2>/dev/null || echo "")

cd ..

print_success "Infrastructure deployed successfully!"

# Display GitHub secrets
print_status "Step 7: GitHub Secrets Configuration"
print_warning "Add these secrets to your GitHub repository:"
print_warning "Go to: Settings → Secrets and variables → Actions → New repository secret"

echo ""
echo "Secret Name: AZURE_CREDENTIALS"
echo "Secret Value:"
echo "{"
echo "  \"clientId\": \"$CLIENT_ID\","
echo "  \"clientSecret\": \"$CLIENT_SECRET\","
echo "  \"subscriptionId\": \"$SUBSCRIPTION_ID\","
echo "  \"tenantId\": \"$TENANT_ID\""
echo "}"
echo ""

if [[ -n "$SWA_TOKEN" ]]; then
    echo "Secret Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
    echo "Secret Value: $SWA_TOKEN"
    echo ""
fi

JWT_SECRET=$(grep jwt_secret infra/terraform.tfvars | cut -d'"' -f2)
echo "Secret Name: JWT_SECRET"
echo "Secret Value: $JWT_SECRET"
echo ""

# Manual deployment option
print_status "Step 8: Application deployment options"
echo "Option 1: Automatic (Recommended)"
echo "  - Configure the GitHub secrets above"
echo "  - Push your code: git push origin main"
echo "  - GitHub Actions will deploy automatically"
echo ""
echo "Option 2: Manual deployment"
read -p "Deploy manually now? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Deploying backend manually..."

    cd backend
    npm ci --only=production

    # Create deployment package
    zip -r ../backend-deployment.zip . -x "tests/*" "*.test.js" "coverage/*"

    # Deploy to App Service
    az webapp deploy \
        --resource-group "rg-$APP_NAME-prod" \
        --name "$APP_NAME-api" \
        --src-path ../backend-deployment.zip

    print_success "Backend deployed!"

    cd ../frontend

    print_status "Deploying frontend..."
    export VITE_API_URL="$BACKEND_URL/api"
    npm ci
    npm run build

    print_success "Frontend built!"
    print_warning "Frontend deployment requires Static Web Apps CLI or GitHub Actions"

    cd ..
fi

# Final summary
print_success "🎉 Deployment completed!"
echo ""
print_status "Your application URLs:"
if [[ -n "$BACKEND_URL" ]]; then
    echo "  Backend API: $BACKEND_URL"
fi
if [[ -n "$FRONTEND_URL" ]]; then
    echo "  Frontend: $FRONTEND_URL"
fi

echo ""
print_status "Next steps:"
echo "  1. Configure GitHub secrets (shown above)"
echo "  2. Push your code to trigger GitHub Actions deployment"
echo "  3. Monitor deployment in GitHub Actions tab"
echo "  4. Test your application once deployed"

print_success "🚀 Your Task Manager is ready for the cloud!"
