#!/usr/bin/env node

/**
 * Standalone test runner for the Task Manager API
 * This runs all tests without requiring external dependencies like MongoDB or a running server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Task Manager - Standalone Test Runner');
console.log('=======================================\n');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';

const runTests = () => {
  return new Promise((resolve, reject) => {
    console.log('📦 Running backend tests with Atlas test database...\n');

    const jest = spawn('npx', ['jest', '--verbose', '--detectOpenHandles'], {
      cwd: path.join(__dirname),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        // Use MongoDB URI from environment variable (set in GitHub secrets or local .env.test)
        MONGODB_URI: process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager_test',
        // Suppress warnings
        SUPPRESS_NO_CONFIG_WARNING: 'true'
      }
    });

    jest.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ All backend tests passed!');
        resolve();
      } else {
        console.log('\n❌ Some tests failed!');
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });

    jest.on('error', (error) => {
      console.error('❌ Failed to run tests:', error.message);
      reject(error);
    });
  });
};

const runCoverage = () => {
  return new Promise((resolve, reject) => {
    console.log('\n📊 Generating test coverage report...\n');

    const jest = spawn('npx', ['jest', '--coverage', '--silent'], {
      cwd: path.join(__dirname),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        MONGODB_URI: '',
        SUPPRESS_NO_CONFIG_WARNING: 'true'
      }
    });

    jest.on('close', (code) => {
      if (code === 0) {
        console.log('\n📈 Coverage report generated successfully!');
        console.log('📁 Check the ./coverage directory for detailed reports\n');
        resolve();
      } else {
        reject(new Error(`Coverage generation failed with exit code ${code}`));
      }
    });

    jest.on('error', (error) => {
      console.error('❌ Failed to generate coverage:', error.message);
      reject(error);
    });
  });
};

const main = async () => {
  try {
    console.log('ℹ️  This test runner uses:');
    console.log('   • In-memory MongoDB (mongodb-memory-server)');
    console.log('   • Mock HTTP requests (supertest)');
    console.log('   • No external dependencies required\n');

    // Check if coverage flag is passed
    const shouldRunCoverage = process.argv.includes('--coverage');

    if (shouldRunCoverage) {
      await runCoverage();
    } else {
      await runTests();
    }

    console.log('🎉 Test execution completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n⏹️  Test execution interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Test execution terminated');
  process.exit(1);
});

// Run the tests
main();
