import { NextFunction, Request, Response } from 'express';

import { ErrorEx } from '@bipdev/common';
import { OrdersStatus } from '@bipdev/contracts';

import { MongoService } from '@src/database';
import { stripe } from '../libs';
import { PaymentCreatedPublisher, natsWrapper } from '@src/events';
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

    const charges = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      description: 'payment service',
    });

    const payment = await DB.payments.addition({
      orderId: order.id,
      stripeId: charges.id,
    });

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ data: { id: payment.id } });
  } catch (e) {
    next(e);
  }
};
