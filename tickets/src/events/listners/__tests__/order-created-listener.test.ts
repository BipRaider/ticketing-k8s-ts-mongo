import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrdersStatus, Subjects, TicketUpdatedEvent } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { TicketsModel } from '../../../model';
import { OrderCreatedListenerEvent } from '../order-created-listener';
import { natsWrapper } from '../../nats-wrapper';
import { TTicketsInstance } from '../../../interfaces';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListenerEvent(natsWrapper.client);

  // create and save ticket
  const userId = createMongoId();
  const ticket: TTicketsInstance = await TicketsModel.addition({
    title: 'concert',
    price: 100,
    userId,
  });

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: createMongoId(),
    userId: userId,
    status: OrdersStatus.Created,
    expiresAt: '',
    ticket: {
      id: ticket.id,
      price: ticket.price,
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

  return { listener, data, msg, ticket, userId };
};

describe('[Order created listener]', () => {
  test('sets the orderId  of the ticket', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    const ticket = await TicketsModel.findById(data.ticket.id);

    expect(ticket).toBeDefined();
    expect(ticket.orderId).toEqual(data.id);
  });
  // test.todo('acks the message');
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
    test('orderId should be valid', () => {
      expect(publisherData.orderId).toEqual(orderId);
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
