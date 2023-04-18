import { ErrorEx } from '@bipdev/common';

import { app } from './app';
import { MongoService } from './database';

const start = async () => {
  console.log('Service start...');
  const salt = process.env['JWT_SALT'];
  if (!salt) throw new ErrorEx('Forbidden', null, 403);

  await new MongoService().connect();

  app.listen(8001, () => {
    console.log('Listening on port 8001!');
  });
};

start();
