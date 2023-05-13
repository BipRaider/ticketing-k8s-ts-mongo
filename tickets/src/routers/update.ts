import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { TicketsUpdate } from '@src/interfaces';
import { MongoService } from '@src/database';
import { TicketUpdatePublisher, natsWrapper } from '@src/events';

export const Update = async (
  req: Request<{ id: string }, unknown, TicketsUpdate>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const DB = new MongoService().tickets;
    const { id } = req.params;
    const { title, price } = req.body;

    const exist = await DB.findById(id).exec();

    if (!exist) throw new ErrorEx('Ticket is not exist', null, 404);
    if (exist.userId !== req?.user?.id) throw new ErrorEx('Unauthorized', null, 401);

    const item = await DB.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          price,
          version: exist.version + 1,
        },
      },
      { new: true },
    ).exec();

    const data = {
      title: item.title,
      price: item.price,
      userId: item.userId,
      version: item.version,
      id: item.id,
    };

    void new TicketUpdatePublisher(natsWrapper.client).publish(data);

    res.status(200).send({ data });
  } catch (e) {
    next(e);
  }
};
