import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';
import { OrdersStatus } from '@bipdev/contracts';

import { MongoService } from '@src/database';
// import { TicketUpdatePublisher, natsWrapper } from '@src/events';

export const deleteOrderById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const DB = new MongoService().orders;
    const { id } = req.params;

    const item = await DB.findById(id);

    if (!item) throw new ErrorEx('The order is not exist', null, 404);
    if (item.userId !== req?.user?.id) throw new ErrorEx('Unauthorized', null, 401);

    item.status = OrdersStatus.Cancelled;
    await item.save();

    // void new TicketUpdatePublisher(natsWrapper.client).publish(data);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
