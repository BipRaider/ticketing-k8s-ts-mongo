import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrdersStatus } from '@bipdev/contracts';

import { OrderCreatedListenerEvent } from '../order-created-listener';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListenerEvent(natsWrapper.client);

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: 'orderId',
    userId: 'userId',
    status: OrdersStatus.Created,
    expiresAt: 'sad',
    ticket: {
      id: 'ticketId',
      price: 10,
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
  test.todo('sets the orderId of the ticket');
  // test('sets the orderId  of the ticket', async () => {
  //   const { listener, data, msg } = await setup();

  //   // call the onMessage func with the data object + message object
  //   await listener.onMessage(data, msg);
  // });
  test.todo('acks the message');
  // test('acks the message', async () => {
  //   const { listener, data, msg } = await setup();

  //   // call the onMessage func with the data object + message object
  //   await listener.onMessage(data, msg);

  //   // write assertions to make sure ask func is called
  //   expect(msg.ack).toHaveBeenCalled();
  // });
});
