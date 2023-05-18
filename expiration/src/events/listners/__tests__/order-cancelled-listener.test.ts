import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, Subjects, TicketUpdatedEvent } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { TicketsModel } from '../../../model';
import { OrderCancelledListenerEvent } from '../order-cancelled-listener';
import { natsWrapper } from '../../nats-wrapper';
import { TTicketsInstance } from '../../../interfaces';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListenerEvent(natsWrapper.client);

  // create and save a ticket
  const userId = createMongoId();
  const orderId = createMongoId();
  const ticket = await TicketsModel.addition({
    title: 'new ticket',
    price: 111,
    userId,
  });
  // add orderId and increase the ticket version
  ticket.set({ orderId });
  await ticket.save();
  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
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
  describe('[Publisher event]', () => {
    let publisherCalls: unknown[];
    let publisherData: TicketUpdatedEvent['data'];
    let orderId: string;
    let existTicket: TTicketsInstance;
    test('publisher a ticket updated event', async () => {
      const { listener, data, msg, ticket } = await setup();
      orderId = data.id;
      existTicket = ticket;
      // call the onMessage func with the data object + message object
      await listener.onMessage(data, msg);

      // the publisher should be call an event
      expect(natsWrapper.client.publish).toHaveBeenCalled();

      publisherCalls = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
      publisherData = JSON.parse(publisherCalls[1] as string);
    });
    test('subject should be valid', () => {
      expect(publisherCalls[0]).toEqual(Subjects.TicketUpdated);
    });
    test('orderId should be undefined', () => {
      expect(publisherData.orderId).toBeUndefined();
    });
    test('userId should be valid', () => {
      expect(publisherData.userId).toEqual(existTicket.userId);
    });
    test('ticket id should be valid', () => {
      expect(publisherData.id).toEqual(existTicket.id);
    });
    test('ticket price should be valid', () => {
      expect(publisherData.price).toEqual(existTicket.price);
    });
    test('ticket title should be valid', () => {
      expect(publisherData.title).toEqual(existTicket.title);
    });
    test('ticket version should be valid', () => {
      expect(publisherData.version).toEqual(existTicket.version + 1);
    });
  });
});
