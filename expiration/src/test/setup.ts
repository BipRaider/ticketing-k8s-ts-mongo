import { beforeAll, beforeEach, afterAll, jest } from '@jest/globals';

jest.mock('../events/nats-wrapper');

beforeAll(async () => {
  return;
});

beforeEach(async () => {
  jest.clearAllMocks();
  return;
});

afterAll(async () => {
  return;
});
