import { beforeAll, beforeEach, afterAll, jest } from '@jest/globals';
import { dbConnect, dbDeleteMany, dbDisconnect } from './utils/mongo';

jest.mock('../events/nats-wrapper');

beforeAll(async () => {
  await dbConnect();
});

beforeEach(async () => {
  jest.clearAllMocks();
  await dbDeleteMany();
});

afterAll(async () => {
  await dbDisconnect();
});
