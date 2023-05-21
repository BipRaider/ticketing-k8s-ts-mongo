import express, { Request } from 'express';
import { json } from 'body-parser';
import { authHandler, errorHandler, errorMiddleware, sessionHandler } from '@bipdev/common';

import routers from './routers';

const app = express();
app.use((req: Request, _res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.dir(req.path);
  }

  next();
});
app.set('trust proxy', true); // traffic is being proximate to our application through ingress nginx.

app.use(json());
app.use(sessionHandler());
app.use('/api/v1/orders', authHandler, routers);
app.use(errorMiddleware);
app.use(errorHandler);

export { app };
