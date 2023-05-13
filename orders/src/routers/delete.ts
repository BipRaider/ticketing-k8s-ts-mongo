import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';
import { OrdersStatus } from '@bipdev/contracts';

import { DB_Module, MongoService } from '@src/database';
import { OrderCancelledPublisher, natsWrapper } from '@src/events';

export const deleteOrderById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const DB = new MongoService().orders;
    const { id } = req.params;

    const order = await DB.findById(id).populate(DB_Module.TICKET);

    if (!order) throw new ErrorEx('The order is not exist', null, 404);
    if (order.userId !== req?.user?.id) throw new ErrorEx('Unauthorized', null, 401);

    order.status = OrdersStatus.Cancelled;
    await order.save();

    void new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
