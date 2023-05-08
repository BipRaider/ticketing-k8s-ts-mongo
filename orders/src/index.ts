import { ErrorEx } from '@bipdev/common';

import { app } from './app';
import { MongoService } from './database';
import { natsWrapper } from './events';

const start = async () => {
  const SRV = process.env['SRV_NAME'];
  if (!SRV) throw new ErrorEx('Forbidden', 'SRV_NAME invalid', 403);

  const port = process.env[`${SRV}_SRV_SERVICE_PORT`] || 8000;
  const salt = process.env['JWT_SALT'];
  const dburl = process.env['MONGO_URL'];
  const natsClusterID = process.env['NATS_CLUSTER_ID'];
  const natsClientID = process.env['NATS_CLIENT_ID'];
  const natsUrl = process.env['NATS_URL'];

  if (!salt) throw new ErrorEx('JWT_SALT must be defined', null, 403);
  if (!dburl) throw new ErrorEx('MONGO_URL must be defined', null, 403);

  console.log('Service start...');

  await new MongoService().connect();
  await natsWrapper.connect(natsClusterID, natsClientID, { url: natsUrl });
  natsWrapper.closeEvent();

  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
};

start();
