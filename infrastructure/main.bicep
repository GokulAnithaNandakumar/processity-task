// Main Bicep template for Task Manager application
// This defines all Azure resources needed for production deployment

@description('Environment name (dev, staging, prod)')
param environment string = 'prod'

@description('Application name prefix')
param appName string = 'taskmanager'

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('GitHub repository URL for Static Web App')
param repositoryUrl string = 'https://github.com/GokulAnithaNandakumar/processity-task'

@description('GitHub branch for deployment')
param repositoryBranch string = 'main'

@description('GitHub personal access token for Static Web App')
@secure()
param githubToken string = ''

@description('MongoDB connection string for the database')
@secure()
param mongoConnectionString string

@description('JWT secret key for authentication')
@secure()
param jwtSecret string

// Variables
var uniqueSuffix = uniqueString(resourceGroup().id)
var appServicePlanName = '${appName}-plan-${environment}-${uniqueSuffix}'
var backendAppName = '${appName}-api-${environment}-${uniqueSuffix}'
var frontendAppName = '${appName}-web-${environment}-${uniqueSuffix}'
var keyVaultName = '${appName}kv${environment}${take(uniqueSuffix, 6)}'
var logAnalyticsName = '${appName}-logs-${environment}-${uniqueSuffix}'
var appInsightsName = '${appName}-insights-${environment}-${uniqueSuffix}'

// App Service Plan (Linux, Node.js optimized)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: environment == 'prod' ? 'B1' : 'F1'
    tier: environment == 'prod' ? 'Basic' : 'Free'
  }
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// Log Analytics Workspace for monitoring
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// Application Insights for monitoring
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// Key Vault for secure secret storage
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
    enableRbacAuthorization: false
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// Simplified version without Key Vault secrets for now
// Store secrets in Key Vault manually after deployment

// Backend API (Node.js App Service)
resource backendApp 'Microsoft.Web/sites@2023-01-01' = {
  name: backendAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'MONGODB_URI'
          value: mongoConnectionString
        }
        {
          name: 'JWT_SECRET'
          value: jwtSecret
        }
        {
          name: 'JWT_EXPIRES_IN'
          value: '7d'
        }
        {
          name: 'CORS_ORIGIN'
          value: 'https://${frontendApp.properties.defaultHostname}'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '20-lts'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://${frontendApp.properties.defaultHostname}'
          'http://localhost:5173'
          'http://localhost:3000'
        ]
        supportCredentials: false
      }
      healthCheckPath: '/api/health'
    }
    httpsOnly: true
    clientAffinityEnabled: false
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// Frontend (Static Web App)
resource frontendApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: frontendAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: repositoryBranch
    repositoryToken: githubToken
    buildProperties: {
      appLocation: '/frontend'
      outputLocation: 'dist'
      skipGithubActionWorkflowGeneration: false
    }
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// Configure Static Web App settings
resource frontendAppSettings 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: frontendApp
  name: 'appsettings'
  properties: {
    VITE_API_URL: 'https://${backendApp.properties.defaultHostName}/api'
  }
}

// Outputs for CI/CD pipeline and documentation
output backendUrl string = 'https://${backendApp.properties.defaultHostName}'
output frontendUrl string = 'https://${frontendApp.properties.defaultHostname}'
output keyVaultName string = keyVault.name
output resourceGroupName string = resourceGroup().name
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output appInsightsConnectionString string = appInsights.properties.ConnectionString
