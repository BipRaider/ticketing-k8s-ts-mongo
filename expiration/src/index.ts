import { natsWrapper } from './events';

const start = async () => {
  const natsClusterID = process.env['NATS_CLUSTER_ID'];
  const natsClientID = process.env['NATS_CLIENT_ID'];
  const natsUrl = process.env['NATS_URL'];

  console.log('Service start...');

  await natsWrapper.init(natsClusterID, natsClientID, { url: natsUrl });
};

start();
