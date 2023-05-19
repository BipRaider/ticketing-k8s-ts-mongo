import Queue from 'bull';

import { Payload } from '@src/interfaces';

import { ExpirationCompletePublisher } from '../publishers';
import { natsWrapper } from '../nats-wrapper';

const redisHost = process.env['REDIS_HOST'];

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: redisHost,
  },
});

expirationQueue.process(async (job: Queue.Job<Payload>): Promise<void> => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data?.orderId,
  });
});
