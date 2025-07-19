# Contributing to Task Manager Application

Thank you for your interest in contributing to the Task Manager Application! This document provides guidelines for contributing to this project.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the proposed feature
- Use cases and benefits
- Any potential drawbacks or considerations

### Development Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/processity-task.git
   cd processity-task
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   # Backend setup
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file

   # Frontend setup
   cd ../frontend
   npm install
   cp .env.example .env
   # Configure your .env file
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Write or update tests as needed

5. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   npm test

   # Frontend tests
   cd frontend
   npm run test
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Use a clear and descriptive title
   - Describe the changes in detail
   - Reference any related issues
   - Include screenshots for UI changes

## Development Guidelines

### Code Style

**Backend (Node.js/Express):**
- Use ES6+ features
- Follow Express.js best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Write meaningful variable and function names

**Frontend (React/TypeScript):**
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Write reusable components
- Implement proper state management

### Testing

- Write unit tests for new features
- Maintain or improve test coverage
- Test edge cases and error conditions
- Use meaningful test descriptions

### Documentation

- Update README.md for significant changes
- Add inline comments for complex logic
- Update API documentation
- Include JSDoc comments for functions

### Security

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices
- Report security vulnerabilities privately

## Project Structure

```
processity-task/
├── backend/          # Node.js Express API
│   ├── config/      # Database and app configuration
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Custom middleware
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── tests/       # Backend tests
│   └── utils/       # Utility functions
├── frontend/         # React application
│   ├── public/      # Static assets
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   └── tests/       # Frontend tests
├── infra/           # Terraform infrastructure
└── .github/         # GitHub workflows
```

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation as needed
3. Add or update tests for your changes
4. Ensure all tests pass
5. Update the README.md if needed
6. The PR will be reviewed by maintainers

## Questions?

If you have questions about contributing, please:

1. Check existing issues and documentation
2. Ask in discussions or create an issue
3. Contact the maintainers

Thank you for contributing!
