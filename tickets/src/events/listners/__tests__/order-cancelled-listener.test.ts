import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { TicketsModel } from '../../../model';
import { OrderCancelledListenerEvent } from '../order-cancelled-listener';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListenerEvent(natsWrapper.client);

  // create and save a ticket
  const userId = createMongoId();
  const ticket = await TicketsModel.addition({
    title: 'new ticket',
    price: 111,
    userId,
  });

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: createMongoId(),
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake data object
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

  return { listener, data, msg, ticket };
};

describe('[Order cancelled listener]', () => {
  test('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created
    const ticketUpdate = await TicketsModel.findById(ticket.id);

    expect(ticketUpdate).toBeDefined();
  });

  test('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ask func is called
    expect(msg.ack).toHaveBeenCalled();
  });

  test('dose not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();
    data.version = 6;
    // call the onMessage func with the data object + message object

    try {
      await listener.onMessage(data, msg);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Ticket not found');
      }
    }

    // write assertions to make sure ask func is called
    expect(msg.ack).not.toHaveBeenCalled();
  });
});
