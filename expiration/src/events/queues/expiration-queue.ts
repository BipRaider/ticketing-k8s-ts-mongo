import Queue from 'bull';

import { Payload } from '@src/interfaces';

const redisHost = process.env['REDIS_HOST'];

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: redisHost,
  },
});

expirationQueue.process(async (job: Queue.Job<Payload>): Promise<void> => {
  console.dir(job.data);
});
