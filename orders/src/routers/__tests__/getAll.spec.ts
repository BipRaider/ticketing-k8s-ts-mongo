import { describe, test, expect, beforeAll } from '@jest/globals';

import { OrdersStatus } from '@bipdev/contracts';

import { query, ResErr, ResOK, routerUrl, createCookie, createMongoId } from '../../test/utils';
import { MongoService } from '../../database';

const db: MongoService = new MongoService();

const ticketCreate = { title: 'concert', price: 10 };
const ticketCreates = [
  { title: 'concert 1', price: 5 },
  { title: 'concert 2', price: 15 },
  { title: 'concert 3', price: 25 },
];

describe('[GET ALL]:', () => {
  describe('[OK]', () => {
    let order: any = {};
    let id: string = createMongoId() as string;
    let ticketId: string = '';

    test('[200] create the order and got of the orders:', async () => {
      const ticket = await db.tickets.addition(ticketCreate);
      ticketId = ticket.id;
      const { cookie } = await createCookie({ id, email: 'test@test.test' });
      await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
      const res = await query(routerUrl.getAll, 'get', {}, '', cookie);

      ResOK(res, 200);

      const { body } = res;
      const { data } = body;
      order = data[0];
    });
    test('returns the status valid:', () => {
      expect(order.status).toBeDefined();
      expect(order.status).toEqual(OrdersStatus.Created);
    });
    test('returns the expiresAt valid:', () => {
      expect(order.expiresAt).toBeDefined();
    });
    test('returns correct id:', () => {
      expect(order.id).toBeDefined();
    });
    test('returns correct userId:', () => {
      expect(order.userId).toBeDefined();
      expect(order.userId).toEqual(id);
    });
    test('returns the ticket valid:', () => {
      expect(order.ticket).toBeDefined();
      expect(order.ticket.id).toEqual(ticketId);
    });
    test('returns the ticket.title valid:', () => {
      expect(order.ticket.title).toEqual(ticketCreate.title);
    });
    test('returns the ticket.price valid:', () => {
      expect(order.ticket.price).toEqual(ticketCreate.price);
    });

    describe('Check several orders', () => {
      let order: any = {};
      let orders: any[] = [];
      let id: string = createMongoId() as string;
      let ticketId: string = '';
      // test.todo('The user cannot receive of the orders that is not own');
      test('[200] Addition several orders and fetches orders for an particular user:', async () => {
        for (const TC of ticketCreates) {
          const ticket = await db.tickets.addition(TC);
          const id = createMongoId() as string;
          const { cookie } = await createCookie({ id, email: 'test@test.test' });
          await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
        }

        const ticket = await db.tickets.addition(ticketCreate);
        ticketId = ticket.id;
        const { cookie } = await createCookie({ id, email: 'test@test.test' });
        await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
        const res = await query(routerUrl.getAll, 'get', {}, '', cookie);

        ResOK(res, 200);

        const { body } = res;
        const { data } = body;
        orders = data;
        order = data[0];
      });

      test('the orders must be one:', () => {
        expect(orders.length).toEqual(1);
      });

      test(`the order must be exist and has status ${OrdersStatus.Created} :`, () => {
        expect(order.status).toBeDefined();
        expect(order.status).toEqual(OrdersStatus.Created);
      });
      test(`owner the order must has this id:${id} :`, () => {
        expect(order.userId).toBeDefined();
        expect(order.userId).toEqual(id);
      });
      test(`the ticket must valid:`, () => {
        expect(order.ticket).toBeDefined();
        expect(order.ticket.id).toEqual(ticketId);
      });
    });
  });
  describe('[ERROR]:', () => {
    test('[401] user is unauthorized:', async () => {
      const res = await query(routerUrl.getAll, 'get', {});
      ResErr(res, 401);
    });
  });
});
