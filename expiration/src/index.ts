import { ErrorEx } from '@bipdev/common';
import { natsWrapper } from './events';

const start = async () => {
  console.dir('Service running...');
  const redisHost = process.env['REDIS_HOST'];
  if (!redisHost) throw new ErrorEx('REDIS_HOST must be defined', null, 403);

  const natsClusterID = process.env['NATS_CLUSTER_ID'];
  const natsClientID = process.env['NATS_CLIENT_ID'];
  const natsUrl = process.env['NATS_URL'];
  console.log('Service start...');

  await natsWrapper.init(natsClusterID, natsClientID, { url: natsUrl });
};

start();
