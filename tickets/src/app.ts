import express, { Request } from 'express';
import { json } from 'body-parser';
import { errorHandler, errorMiddleware, sessionHandler } from '@bipdev/common';

// import TicketRouter from './routers';

const app = express();
app.use((req: Request, _res, next) => {
  console.dir(req.path);

  next();
});
app.set('trust proxy', true); // traffic is being proximate to our application through ingress nginx.

app.use(json());
app.use(sessionHandler());
// app.use('/api/v1/tickets', TicketRouter);
app.use(errorMiddleware);
app.use(errorHandler);

export { app };
