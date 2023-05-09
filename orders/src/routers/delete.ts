import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { MongoService } from '@src/database';
// import { TicketUpdatePublisher, natsWrapper } from '@src/events';

export const deleteOrderById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const DB = new MongoService().orders;
    const { id } = req.params;

    const exist = await DB.findById(id).exec();

    if (!exist) throw new ErrorEx('Ticket is not exist', null, 404);
    if (exist.userId !== req?.user?.id) throw new ErrorEx('Unauthorized', null, 401);

    const item = await DB.findByIdAndDelete(id).exec();

    const data = {
      status: item.status,
      expiresAt: item.expiresAt,
      userId: item.userId,
      ticket: item.ticket,
      id: item.id,
    };

    // void new TicketUpdatePublisher(natsWrapper.client).publish(data);

    res.status(200).send({ data });
  } catch (e) {
    next(e);
  }
};
