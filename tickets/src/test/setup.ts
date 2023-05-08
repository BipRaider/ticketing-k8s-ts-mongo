import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import { dbConnect, dbDeleteMany, dbDisconnect } from './utils/mongo';

jest.mock('../events/nats-wrapper');

beforeAll(async () => {
  await dbConnect();
});

beforeEach(async () => {
  await dbDeleteMany();
});

afterAll(async () => {
  await dbDisconnect();
});
