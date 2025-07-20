// Simplified Bicep template without Static Web App for initial deployment
// This deploys backend infrastructure that we can test first

@description('Environment name (dev, staging, prod)')
param environment string = 'prod'

@description('Application name prefix')
param appName string = 'taskmanager'

@description('Azure region for deployment')
param location string = resourceGroup().location

// Variables
var uniqueSuffix = uniqueString(resourceGroup().id)
var appServicePlanName = '${appName}-plan-${environment}-${uniqueSuffix}'
var backendAppName = '${appName}-api-${environment}-${uniqueSuffix}'
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
          value: 'mongodb+srv://gokul:gokul@cluster.vimceyx.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster'
        }
        {
          name: 'JWT_SECRET'
          value: 'bae500756288df8fcfed406b3e61f5b2e10f4f0628e8c38725da0effca61a11c'
        }
        {
          name: 'JWT_EXPIRES_IN'
          value: '7d'
        }
        {
          name: 'CORS_ORIGIN'
          value: '*'
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
          '*'
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

// Outputs
output backendUrl string = 'https://${backendApp.properties.defaultHostName}'
output keyVaultName string = keyVault.name
output resourceGroupName string = resourceGroup().name
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output appInsightsConnectionString string = appInsights.properties.ConnectionString
