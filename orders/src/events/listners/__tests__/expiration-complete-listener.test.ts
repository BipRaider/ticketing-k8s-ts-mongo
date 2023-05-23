import { describe, test, jest, expect } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrdersStatus, OrderCancelledEvent } from '@bipdev/contracts';

import { createMongoId } from '../../../test/utils';

import { OrdersModel, TicketsModel } from '../../../model';
import { ExpirationCompleteListenerEvent } from '../expiration-complete-listener';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListenerEvent(natsWrapper.client);

  const userId = createMongoId();
  const ticketId = createMongoId();
  // create and save a ticket
  const ticket = await TicketsModel.addition({
    id: ticketId,
    title: 'new ticket',
    price: 111,
  });

  // create and save a order
  const EXPIRATION_WINDOW_SECOND = 15 * 60;
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECOND);

  const order = await OrdersModel.addition({
    status: OrdersStatus.Created,
    expiresAt,
    userId,
    ticket,
  });

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
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

  return { listener, data, msg, ticket, order, userId };
};

describe('[Expiration complete listener]', () => {
  test('updated the order status to cancelled', async () => {
    const { listener, data, msg, order } = await setup();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created
    const orderComplete = await OrdersModel.findById(order.id);

    expect(orderComplete).toBeDefined();
    expect(orderComplete.status).toEqual(OrdersStatus.Cancelled);
    expect(orderComplete.version).toEqual(1);
  });

  test('acks the message', async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure ask func is called
    expect(msg.ack).toHaveBeenCalled();
  });

  test('dose not call ack if the order not found', async () => {
    const { listener, data, msg, userId } = await setup();
    data.orderId = userId;
    // call the onMessage func with the data object + message object
    try {
      await listener.onMessage(data, msg);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Order not found');
      }
    }
    // write assertions to make sure ask func is called
    expect(msg.ack).not.toHaveBeenCalled();
  });
  test('dose not call publisher event if the order complete', async () => {
    const { listener, data, msg, order } = await setup();
    order.set({ status: OrdersStatus.Complete });
    await order.save();

    // call the onMessage func with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ask func is called
    expect(msg.ack).toHaveBeenCalled();

    // the publisher cannot be call an event
    expect(natsWrapper.client.publish).not.toHaveBeenCalled();
  });
  describe('[Emit a publisher event]', () => {
    let publisherCalls: unknown[];
    let publisherData: OrderCancelledEvent['data'];
    let orderId: string;
    let ticketId: string;
    test('publisher a order cancelled event', async () => {
      const { listener, data, msg, order, ticket } = await setup();
      orderId = order.id;
      ticketId = ticket.id;
      // call the onMessage func with the data object + message object
      await listener.onMessage(data, msg);

      // the publisher should be call an event
      expect(natsWrapper.client.publish).toHaveBeenCalled();

      publisherCalls = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
      publisherData = JSON.parse(publisherCalls[1] as string);
    });

    test('orderId should be valid', () => {
      expect(orderId).toEqual(publisherData.id);
    });
    test('ticket id should be valid', () => {
      expect(ticketId).toEqual(publisherData.ticket.id);
    });
    test('version should be 1', () => {
      expect(publisherData.version).toEqual(1);
    });
  });
});
