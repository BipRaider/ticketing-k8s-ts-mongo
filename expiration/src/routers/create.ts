import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { TicketsCreate } from '@src/interfaces';
import { MongoService } from '@src/database';
import { TicketCreatePublisher, natsWrapper } from '@src/events';

export const Create = async (
  req: Request<unknown, unknown, TicketsCreate>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const DB = new MongoService().tickets;
    const { title, price } = req.body;
    const userId = req.user.id;
    const exist = await DB.findOne({ title }).exec();
    if (exist) throw new ErrorEx('Ticket exist', null, 400);
    const item = await DB.addition({ title, price, userId });

    const data = {
      title: item.title,
      price: item.price,
      userId: item.userId,
      version: item.version,
      id: item.id,
    };

    await new TicketCreatePublisher(natsWrapper.client).publish(data);

    res.status(201).send({ data });
    return;
  } catch (e) {
    next(e);
  }
};
