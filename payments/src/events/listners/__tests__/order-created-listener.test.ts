import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrdersStatus } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { OrdersModel } from '../../../model';
import { OrderCreatedListenerEvent } from '../order-created-listener';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListenerEvent(natsWrapper.client);
  //create a fake data event
  const data: OrderCreatedEvent['data'] = {
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

  return { listener, data, msg };
};

describe('[Order created listener]', () => {
  test('replicates the order info', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a order was created
    const order = await OrdersModel.findById(data.id);

    expect(order).toBeDefined();
    expect(order.id).toEqual(data.id);
    expect(order.status).toEqual(data.status);
    expect(order.userId).toEqual(data.userId);
    expect(order.price).toEqual(data.ticket.price);
    expect(order.version).toEqual(data.version);
  });
  // test.todo('acks the message');
  test('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ask func is called
    expect(msg.ack).toHaveBeenCalled();
  });
});
