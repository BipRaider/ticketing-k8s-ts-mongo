import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { OrdersStatus } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { OrderCreatePublisher, natsWrapper } from '@src/events';

const EXPIRATION_WINDOW_SECOND = 15 * 60;

export const createOrder = async (
  req: Request<unknown, unknown, { ticketId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { ticketId } = req.body;
    const userId = req.user.id;
    const DB = new MongoService();

    const ticket = await DB.tickets.findById(ticketId);
    if (!ticket) throw new ErrorEx('Ticket is not exist', null, 404);

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new ErrorEx('Ticket is already reserved.', null, 400);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECOND);
    const order = await DB.orders.addition({ status: OrdersStatus.Created, expiresAt, userId, ticket });

    const data = {
      status: order.status,
      expiresAt: order.expiresAt,
      userId: order.userId,
      ticket: order.ticket,
      id: order.id,
    };

    void new OrderCreatePublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: { id: ticket.id, price: ticket.price },
    });

    res.status(201).send({ data });
  } catch (e) {
    next(e);
  }
};
