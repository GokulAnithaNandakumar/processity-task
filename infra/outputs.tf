output "backend_url" {
  description = "URL of the backend API"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  description = "URL of the frontend application"
  value       = "https://${azurerm_static_site.frontend.default_host_name}"
}

output "cosmos_db_endpoint" {
  description = "Cosmos DB endpoint"
  value       = azurerm_cosmosdb_account.main.endpoint
  sensitive   = true
}

output "cosmos_db_primary_key" {
  description = "Cosmos DB primary key"
  value       = azurerm_cosmosdb_account.main.primary_key
  sensitive   = true
}

output "key_vault_uri" {
  description = "Key Vault URI"
  value       = azurerm_key_vault.main.vault_uri
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}
