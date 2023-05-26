import { jest } from '@jest/globals';

export const stripe = {
  charges: {
    // @ts-ignore
    create: jest.fn().mockResolvedValue({}),
  },
};
