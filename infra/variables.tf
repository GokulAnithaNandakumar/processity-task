variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "taskmanager"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-taskmanager-dev"
}

variable "app_service_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
}

variable "database_name" {
  description = "Name of the MongoDB database"
  type        = string
  default     = "taskmanager"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
  default     = "your-super-secret-jwt-key-change-in-production-this-should-be-random"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "development"
    Project     = "TaskManager"
    ManagedBy   = "Terraform"
  }
}
