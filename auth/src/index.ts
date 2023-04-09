import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import UserRouter from './routers';
import { errorHandler, errorMiddleware } from './middlewares';
import { MongoService } from './database';

const cookieSessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  signed: false,
  secure: true,
};

const app = express();
app.set('trust proxy', true); // traffic is being proximate to our application through ingress nginx.

app.use(json());
app.use(cookieSession(cookieSessionOptions));

app.use('/api/v1/users', UserRouter);
app.use(errorMiddleware);
app.use(errorHandler);

new MongoService().connect();

app.listen(8001, () => {
  console.log('Listening on port 8001!');
});
