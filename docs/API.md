# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://taskmanager-api.azurewebsites.net/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "data": {
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "data": {
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Tasks

All task endpoints require authentication.

#### GET /tasks
Get all tasks for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of tasks per page (default: 10, max: 100)
- `sortBy` (optional): Sort field (`createdAt`, `dueDate`, `title`, `priority`)
- `sortOrder` (optional): Sort order (`asc`, `desc`)

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "data": {
    "tasks": [
      {
        "_id": "task-id",
        "title": "Complete project",
        "description": "Finish the task manager application",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2023-01-15T00:00:00.000Z",
        "user": "user-id",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "isOverdue": false
      }
    ]
  }
}
```

#### GET /tasks/:id
Get a specific task by ID.

**Response:**
```json
{
  "status": "success",
  "data": {
    "task": {
      "_id": "task-id",
      "title": "Complete project",
      "description": "Finish the task manager application",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2023-01-15T00:00:00.000Z",
      "user": "user-id",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "isOverdue": false
    }
  }
}
```

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2023-01-15T00:00:00.000Z"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "task": {
      "_id": "new-task-id",
      "title": "New task",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2023-01-15T00:00:00.000Z",
      "user": "user-id",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /tasks/:id
Update an existing task.

**Request Body:**
```json
{
  "title": "Updated task",
  "status": "completed"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "task": {
      "_id": "task-id",
      "title": "Updated task",
      "description": "Task description",
      "status": "completed",
      "priority": "medium",
      "dueDate": "2023-01-15T00:00:00.000Z",
      "user": "user-id",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

#### DELETE /tasks/:id
Delete a task.

**Response:**
```json
{
  "status": "success",
  "message": "Task deleted successfully"
}
```

#### GET /tasks/stats/overview
Get task statistics for the authenticated user.

**Response:**
```json
{
  "status": "success",
  "data": {
    "stats": [
      { "_id": "pending", "count": 5 },
      { "_id": "in-progress", "count": 3 },
      { "_id": "completed", "count": 10 }
    ],
    "overdue": 2,
    "total": 18
  }
}
```

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "success",
  "message": "Task Manager API is running",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Exceeded requests will receive a 429 status code

## Data Validation

### User Registration
- `name`: 2-50 characters, required
- `email`: Valid email format, required, unique
- `password`: Minimum 6 characters, required

### Task Creation/Update
- `title`: 1-100 characters, required
- `description`: Maximum 500 characters, optional
- `status`: Must be one of: `pending`, `in-progress`, `completed`
- `priority`: Must be one of: `low`, `medium`, `high`
- `dueDate`: ISO 8601 date string, cannot be in the past, optional
