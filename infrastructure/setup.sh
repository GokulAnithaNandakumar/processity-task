#!/bin/bash

# Infrastructure Setup Script
# This script sets up the Azure infrastructure for the Task Manager application

set -e  # Exit on any error

echo "🚀 Task Manager - Infrastructure Setup"
echo "======================================"

# Configuration
RESOURCE_GROUP="rg-taskmanager-prod"
LOCATION="East US"
SUBSCRIPTION_ID="ed959e3d-29c2-4f86-b95f-1525af4de229"  # Set your subscription ID

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi

    # Check if user is logged in
    if ! az account show &> /dev/null; then
        log_error "Please log in to Azure CLI first: az login"
        exit 1
    fi

    # Check if Bicep is available
    if ! az bicep version &> /dev/null; then
        log_info "Installing Bicep..."
        az bicep install
    fi

    log_success "Prerequisites check completed"
}

# Set subscription
set_subscription() {
    if [ -n "$SUBSCRIPTION_ID" ]; then
        log_info "Setting subscription to: $SUBSCRIPTION_ID"
        az account set --subscription "$SUBSCRIPTION_ID"
    else
        log_info "Using current subscription:"
        az account show --query "{Name:name, SubscriptionId:id}" --output table
    fi
}

# Create resource group
create_resource_group() {
    log_info "Creating resource group: $RESOURCE_GROUP"
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --tags Environment=prod Application=taskmanager CreatedBy=IaC
    log_success "Resource group created successfully"
}

# Validate Bicep template
validate_template() {
    log_info "Validating Bicep template..."
    az bicep build --file infrastructure/main.bicep
    log_success "Bicep template validation completed"
}

# Deploy infrastructure
deploy_infrastructure() {
    log_info "Starting infrastructure deployment..."
    log_warning "This will create Azure resources and may incur costs."

    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled by user"
        exit 0
    fi

    # Get required parameters
    echo
    read -p "Enter MongoDB connection string: " -s MONGODB_URI
    echo
    read -p "Enter JWT secret key: " -s JWT_SECRET
    echo
    read -p "Enter GitHub personal access token (optional): " -s GITHUB_TOKEN
    echo

    log_info "Deploying infrastructure..."
    az deployment group create \
        --resource-group "$RESOURCE_GROUP" \
        --template-file infrastructure/main.bicep \
        --parameters infrastructure/parameters.prod.json \
        --parameters mongoConnectionString="$MONGODB_URI" \
        --parameters jwtSecret="$JWT_SECRET" \
        --parameters githubToken="$GITHUB_TOKEN" \
        --output table

    log_success "Infrastructure deployment completed!"
}

# Get deployment outputs
get_outputs() {
    log_info "Getting deployment outputs..."

    DEPLOYMENT_NAME=$(az deployment group list \
        --resource-group "$RESOURCE_GROUP" \
        --query "[0].name" --output tsv)

    if [ -n "$DEPLOYMENT_NAME" ]; then
        echo
        echo "🌐 Deployment URLs:"
        echo "=================="
        az deployment group show \
            --resource-group "$RESOURCE_GROUP" \
            --name "$DEPLOYMENT_NAME" \
            --query "properties.outputs" \
            --output table
    fi
}

# Setup GitHub secrets (instructions)
setup_github_secrets() {
    log_info "Setting up GitHub Actions..."
    echo
    echo "📋 GitHub Secrets Setup:"
    echo "========================"
    echo "Go to: https://github.com/GokulAnithaNandakumar/processity-task/settings/secrets/actions"
    echo
    echo "Add these secrets:"
    echo "1. AZURE_CREDENTIALS - Service principal JSON"
    echo "2. MONGODB_CONNECTION_STRING - Your MongoDB connection string"
    echo "3. JWT_SECRET - Your JWT secret key"
    echo "4. GITHUB_TOKEN - Personal access token for Static Web Apps"
    echo
    echo "To create service principal:"
    echo "az ad sp create-for-rbac --name 'taskmanager-github-actions' --role 'Contributor' --scopes '/subscriptions/$(az account show --query id -o tsv)' --sdk-auth"
}

# Main execution
main() {
    echo
    check_prerequisites
    echo
    set_subscription
    echo
    create_resource_group
    echo
    validate_template
    echo
    deploy_infrastructure
    echo
    get_outputs
    echo
    setup_github_secrets
    echo
    log_success "Setup completed! Your infrastructure is ready."
    echo
    echo "Next steps:"
    echo "1. Configure GitHub secrets as shown above"
    echo "2. Push your code to trigger the CI/CD pipeline"
    echo "3. Monitor the deployment in GitHub Actions"
}

# Run main function
main "$@"
