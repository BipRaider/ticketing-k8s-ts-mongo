import { describe, test, expect, beforeAll } from '@jest/globals';
import { OrdersStatus } from '@bipdev/contracts';

import { query, ResErr, ResOK, routerUrl, createCookie, createMongoId } from '../../test/utils';

import { natsWrapper } from '../../events/nats-wrapper';
import { MongoService } from '../../database';

const ticketsCreate = { ticketId: createMongoId() };
const EXPIRATION_WINDOW_SECOND = 15 * 60;
const db: MongoService = new MongoService();

describe('[Create]:', () => {
  describe('[OK]:', () => {
    let order: any = {};
    test('[201] create the order successfully:', async () => {
      const ticket = await db.tickets.addition({
        title: 'concert',
        price: 10,
      });

      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
      ResOK(res, 201);
      const { body } = res;
      const { data } = body;
      order = data;
    });
    test('returns the status valid:', () => {
      expect(order.status).toBeDefined();
      expect(order.status).toEqual(OrdersStatus.Created);
    });
    test('returns the expiresAt valid:', () => {
      expect(order.expiresAt).toBeDefined();
    });
    test('returns the ticket valid:', () => {
      expect(order.ticket).toBeDefined();
    });
    test('returns correct id:', () => {
      expect(order.id).toBeDefined();
    });
    test('returns correct userId:', () => {
      expect(order.userId).toBeDefined();
    });
    test.todo('emits an order created event');
    // test('[201] Check publisher an event :', async () => {
    //   const { cookie } = await createCookie();
    //   const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
    //   ResOK(res, 201);
    //   expect(natsWrapper.client.publish).toHaveBeenCalled();
    // });
  });
  describe('[ERROR]:', () => {
    test('[401] user is unauthorized:', async () => {
      const res = await query(routerUrl.create, 'post', ticketsCreate);
      ResErr(res, 401);
    });
    test('[400] missing data of a ticketId:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { ticketId: '', price: '' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[400] invalid data of a ticketId:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { ticketId: 'sdfsdf' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[404] the ticket does not exist:', async () => {
      const { cookie } = await createCookie();
      await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResErr(res, 404, 'Ticket is not exist');
    });
    test('[400] the ticket is already reserved:', async () => {
      const userId = createMongoId() as string;
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECOND);

      const ticket = await db.tickets.addition({
        title: 'concert',
        price: 10,
      });

      await db.orders.addition({
        ticket,
        userId,
        expiresAt,
        status: OrdersStatus.Created,
      });

      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
      ResErr(res, 400, 'Ticket is already reserved.');
    });
  });
});
