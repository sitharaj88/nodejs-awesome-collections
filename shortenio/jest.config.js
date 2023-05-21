module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    
    testMatch: [
      '**/__tests__/**/*.test.js',
    ],
    collectCoverage: true,
    coverageReporters: ['html', 'text'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/**/*.test.js',
      '!src/database/**', // Exclude database configuration files from coverage
    ],
    transformIgnorePatterns: [
      '/node_modules/(?!(mongoose)/)', // Include mongoose for Babel transformation
    ],
  };