import { NextFunction, Request, Response } from 'express';

import { ErrorEx } from '@bipdev/common';
import { OrdersStatus } from '@bipdev/contracts';

import { MongoService } from '@src/database';
import { stripe } from '../libs';
// import { OrderCreatePublisher, natsWrapper } from '@src/events';

export const createCharge = async (
  req: Request<unknown, unknown, { orderId: string; token: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderId, token } = req.body;
    const userId = req.user.id;
    const DB = new MongoService();

    const order = await DB.orders.findById(orderId);

    if (!order) throw new ErrorEx('The order is not exist', null, 404);
    if (userId !== order.userId) throw new ErrorEx('Unauthorized', null, 401);
    if (order.status === OrdersStatus.Cancelled) throw new ErrorEx('Cannot pay for an cancelled order', null, 400);

    await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
    });

    // const expiresAt = new Date();
    // expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECOND);
    // const order = await DB.orders.addition({ status: OrdersStatus.Created, expiresAt, userId, ticket });

    // const data = {
    //   status: order.status,
    //   expiresAt: order.expiresAt,
    //   userId: order.userId,
    //   ticket: order.ticket,
    //   id: order.id,
    // };

    // void new OrderCreatePublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   userId: order.userId,
    //   status: order.status,
    //   expiresAt: order.expiresAt.toISOString(),
    //   version: order.version,
    //   ticket: { id: ticket.id, price: ticket.price },
    // });

    res.status(204).send({ data: order });
  } catch (e) {
    next(e);
  }
};
