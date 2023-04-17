import express, { Request } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import UserRouter from './routers';
import { errorHandler, errorMiddleware } from './middlewares';

const cookieSessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  name: 'session',
  keys: ['secretKeys'],
  signed: false,
  secure: process.env.NODE_ENV !== 'test', //if https request
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};
const app = express();
app.use((req: Request, _res, next) => {
  console.dir(req.path);

  next();
});
app.set('trust proxy', true); // traffic is being proximate to our application through ingress nginx.

app.use(json());
app.use(cookieSession(cookieSessionOptions));

app.use('/api/v1/users', UserRouter);
app.use(errorMiddleware);
app.use(errorHandler);

export { app };
