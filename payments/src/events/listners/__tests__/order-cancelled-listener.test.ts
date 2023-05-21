import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderCancelledEvent, OrdersStatus } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { OrdersModel } from '../../../model';
import { OrderCancelledListenerEvent } from '../order-cancelled-listener';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListenerEvent(natsWrapper.client);
  //create a fake order data
  const orderData: OrderCreatedEvent['data'] = {
    id: createMongoId(),
    userId: createMongoId(),
    status: OrdersStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: createMongoId(),
      price: 111,
    },
  };
  // create order
  const order = await OrdersModel.addition({
    id: orderData.id,
    status: orderData.status,
    version: orderData.version,
    userId: orderData.userId,
    price: orderData?.ticket.price,
  });

  //create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: orderData.ticket.id,
    },
  };

  //create a fake data object
  const msg: Message = {
    ack: jest.fn(),
    getSubject: jest.fn((): string => 'getSubject'),
    getSequence: jest.fn((): number => 0),
    getRawData: jest.fn((): Buffer => Buffer.from(new Date().toISOString())),
    getData: jest.fn((): string => new Date().toISOString()),
    getTimestampRaw: jest.fn((): number => new Date().getTime()),
    getTimestamp: jest.fn((): Date => new Date()),
    isRedelivered: jest.fn((): boolean => true),
    getCrc32: jest.fn((): number => 32),
  };

  return { listener, data, msg, order };
};

describe('[Order cancelled listener]', () => {
  test('updates the status of the order', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await OrdersModel.findById(order.id);

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder.version).toEqual(1);
    expect(updatedOrder.status).toEqual(OrdersStatus.Cancelled);
  });

  // test.todo('acks the message');
  test('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  test('Error order not found', async () => {
    const { listener, data, msg } = await setup();
    data.version = 11;

    try {
      await listener.onMessage(data, msg);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Order not found.');
      }
    }

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
