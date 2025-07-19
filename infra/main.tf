# Azure Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

# Azure App Service Plan
resource "azurerm_service_plan" "main" {
  name                = "${var.app_name}-plan"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  sku_name           = var.app_service_sku
  os_type            = "Linux"

  tags = var.tags
}

# Azure App Service for Backend API
resource "azurerm_linux_web_app" "backend" {
  name                = "${var.app_name}-api"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }

    cors {
      allowed_origins = [
        "https://${var.app_name}-frontend.azurestaticapps.net",
        var.environment == "development" ? "http://localhost:3000" : null
      ]
      support_credentials = true
    }
  }

  app_settings = {
    "NODE_ENV"                    = var.environment
    "MONGODB_URI"                = azurerm_cosmosdb_account.main.connection_strings[0]
    "JWT_SECRET"                 = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=jwt-secret)"
    "WEBSITE_RUN_FROM_PACKAGE"   = "1"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

# Azure Static Web Apps for Frontend
resource "azurerm_static_site" "frontend" {
  name                = "${var.app_name}-frontend"
  resource_group_name = azurerm_resource_group.main.name
  location           = "West Europe"  # Static Web Apps limited regions
  sku_tier           = "Free"
  sku_size           = "Free"

  tags = var.tags
}

# Azure Cosmos DB Account
resource "azurerm_cosmosdb_account" "main" {
  name                = "${var.app_name}-cosmos"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  offer_type         = "Standard"
  kind               = "MongoDB"

  capabilities {
    name = "EnableMongo"
  }

  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  tags = var.tags
}

# Azure Cosmos DB MongoDB Database
resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = var.database_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

# Azure Key Vault
resource "azurerm_key_vault" "main" {
  name                = "${var.app_name}-kv"
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id          = data.azurerm_client_config.current.tenant_id
  sku_name           = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Recover",
      "Backup",
      "Restore"
    ]
  }

  # Grant access to the App Service
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_linux_web_app.backend.identity[0].principal_id

    secret_permissions = [
      "Get",
      "List"
    ]
  }

  tags = var.tags
}

# Store JWT Secret in Key Vault
resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = var.jwt_secret
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault.main]
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "${var.app_name}-insights"
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "Node.JS"

  tags = var.tags
}

# Data source for current Azure client config
data "azurerm_client_config" "current" {}
