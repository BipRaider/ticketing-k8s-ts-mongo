import { beforeAll, beforeEach, afterAll, jest } from '@jest/globals';

jest.mock('../events/nats-wrapper');

beforeAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {});
