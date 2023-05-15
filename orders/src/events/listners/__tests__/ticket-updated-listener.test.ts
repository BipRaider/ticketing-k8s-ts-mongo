import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { TicketsModel } from '../../../model';
import { TicketUpdatedListenerEvent } from '../ticket-updated-listeners';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListenerEvent(natsWrapper.client);

  const userId = createMongoId();
  const ticketId = createMongoId();
  // create and save a ticket
  const ticket = await TicketsModel.addition({
    id: ticketId,
    title: 'new ticket',
    price: 111,
  });

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'second concert',
    price: 333,
    userId,
    version: 1,
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

describe('[Ticket updated listener]', () => {
  test('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created
    const ticketUpdate = await TicketsModel.findById(ticket.id);

    expect(ticketUpdate).toBeDefined();
    expect(ticketUpdate.title).toEqual(data.title);
    expect(ticketUpdate.price).toEqual(data.price);
    expect(ticketUpdate.version).toEqual(data.version);
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
