module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!quick-test.js",
    "!test-runner.js"
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 60000, // 60 seconds for database operations
  forceExit: true,
  detectOpenHandles: true,
  clearMocks: true,
  verbose: true,
  maxWorkers: 1 // Run tests sequentially to avoid connection conflicts
};
