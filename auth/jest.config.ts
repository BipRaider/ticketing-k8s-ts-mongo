import type { Config } from '@jest/types';
import { defaults } from 'jest-config';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  collectCoverage: true,
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'js', 'json', 'node', 'jsx', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  // globalSetup: '<rootDir>/src/test/globalSetup.ts',
  // globalTeardown: '<rootDir>/src/test/globalTeardown.ts',
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  displayName: 'test',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};

export default config;
