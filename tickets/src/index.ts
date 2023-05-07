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
  if (!salt && !dburl) throw new ErrorEx('Forbidden', null, 403);
  console.log('Service start...');

  await new MongoService().connect();

  await natsWrapper.connect('ticketing', 'ticketServer', { url: 'http://nats-srv:4222' });
  natsWrapper.closeEvent();

  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
};

start();
