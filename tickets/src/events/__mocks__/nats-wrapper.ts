import { jest } from '@jest/globals';
import { StanOptions } from 'node-nats-streaming';

type MockPublish = (subject: string, data: string, callback: () => void) => void;
type MockInit = (clusterID: string, clientID: string, opts?: StanOptions | undefined) => Promise<void>;
export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // },
    publish: jest.fn<MockPublish>().mockImplementation((subject: string, data: string, callback: () => void) => {
      callback();
    }),
  },
  init: jest.fn<MockInit>().mockImplementation(async (clusterID, clientID, opts) => {
    natsWrapper.connect(clusterID, clientID, opts);
    natsWrapper.listeners();
    natsWrapper.closeEvent();
  }),

  connect: jest.fn<MockInit>().mockImplementation(async (clusterID, clientID, opts) => {}),
  listeners: jest.fn(),
  closeEvent: jest.fn(),
};
