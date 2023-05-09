import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { OrdersCreate } from '@src/interfaces';
import { MongoService } from '@src/database';
// import { TicketCreatePublisher, natsWrapper } from '@src/events';

export const createOrder = async (
  req: Request<unknown, unknown, OrdersCreate>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const DB = new MongoService().orders;
    const { status, expiresAt, ticket } = req.body;
    const userId = req.user.id;
    const exist = await DB.findOne({ status }).exec();
    if (exist) throw new ErrorEx('Ticket exist', null, 400);
    const item = await DB.addition({ status, expiresAt, userId, ticket });

    const data = {
      status: item.status,
      expiresAt: item.expiresAt,
      userId: item.userId,
      ticket: item.ticket,
      id: item.id,
    };

    // await new TicketCreatePublisher(natsWrapper.client).publish(data);

    res.status(201).send({ data });
    return;
  } catch (e) {
    next(e);
  }
};
