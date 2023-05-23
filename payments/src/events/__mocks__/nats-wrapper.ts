import { jest } from '@jest/globals';

type MockPublish = (subject: string, data: string, callback: () => void) => void;

export const natsWrapper = {
  client: {
    publish: jest.fn<MockPublish>().mockImplementation((subject: string, data: string, callback: () => void) => {
      callback();
    }),
  },
};
