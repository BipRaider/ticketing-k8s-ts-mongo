import type { Config } from '@jest/types';
import { defaults } from 'jest-config';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  displayName: {
    name: 'auth',
    color: 'yellowBright',
  },

  // test files
  testMatch: [
    '<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // coverage
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s', '!src/test/utils/*.ts', '!src/interfaces/*.ts'],

  // this list paths from tsconfig.json
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'js', 'json', 'node', 'jsx', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],

  // setup
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  // globalSetup: '<rootDir>/src/test/globalSetup.ts',
  // globalTeardown: '<rootDir>/src/test/globalTeardown.ts',

  // transform
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
  },

  //Env data
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },

  //Ignore files or folder
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/src/test/utils/*.ts', '<rootDir>/src/interfaces/*.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/src/test/utils/*.ts', '<rootDir>/src/interfaces/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/src/test/utils/*.ts', '<rootDir>/src/interfaces/*.ts'],
};

export default config;
