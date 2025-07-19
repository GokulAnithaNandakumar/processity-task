module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'models/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
