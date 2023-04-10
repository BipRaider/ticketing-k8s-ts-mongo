import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import UserRouter from './routers';
import { errorHandler, errorMiddleware } from './middlewares';
import { MongoService } from './database';
import { ErrorEx } from './helper';

const cookieSessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  name: 'session',
  keys: ['secretKeys'],
  signed: false,
  secure: true, //if https request
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

const start = async () => {
  console.log('Service start...');
  const salt = process.env['JWT_SALT'];
  if (!salt) throw new ErrorEx('Forbidden', null, 403);

  const app = express();
  app.set('trust proxy', true); // traffic is being proximate to our application through ingress nginx.

  app.use(json());
  app.use(cookieSession(cookieSessionOptions));

  app.use('/api/v1/users', UserRouter);
  app.use(errorMiddleware);
  app.use(errorHandler);

  await new MongoService().connect();

  app.listen(8001, () => {
    console.log('Listening on port 8001!');
  });
};

start();
