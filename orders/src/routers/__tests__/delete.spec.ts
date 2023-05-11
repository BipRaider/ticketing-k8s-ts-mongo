import { describe, test, expect } from '@jest/globals';

import { query, ResErr, routerUrl, createCookie, ResOK, createMongoId } from '../../test/utils';
import { natsWrapper } from '../../events/nats-wrapper';
import { OrdersStatus } from '@bipdev/contracts';

import { DB_Module, MongoService } from '../../database';

const db: MongoService = new MongoService();

const ticketCreate = { title: 'concert', price: 10 };

describe('[Delete]:', () => {
  // test.todo('Need an implementation works of the Delete func');

  describe('[OK]:', () => {
    let order: any = {};
    let id: string = createMongoId() as string;
    let ticketId: string = '';

    test(`[204] Change status of the order by id on ${OrdersStatus.Cancelled}:`, async () => {
      const ticket = await db.tickets.addition(ticketCreate);
      ticketId = ticket.id;

      const { cookie } = await createCookie({ id, email: 'test@test.test' });
      const existOrder = await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
      ResOK(existOrder, 201);
      const { body: bodyCreate } = existOrder;
      const { data: dataCreate } = bodyCreate;

      const del = await query(routerUrl.delete(dataCreate.id), 'delete', {}, '', cookie);
      const { statusCode } = del;

      expect(statusCode).toEqual(204);

      order = await db.orders.findById(dataCreate.id).populate(DB_Module.TICKET).exec();
    });
    test('returns the status valid:', () => {
      expect(order.status).toBeDefined();
      expect(order.status).toEqual(OrdersStatus.Cancelled);
    });
    test('returns the expiresAt valid:', () => {
      expect(order.expiresAt).toBeDefined();
    });
    test('returns correct the id:', () => {
      expect(order.id).toBeDefined();
    });
    test('returns correct the userId:', () => {
      expect(order.userId).toBeDefined();
      expect(order.userId).toEqual(id);
    });
    test('returns correct the ticket id:', () => {
      expect(order.ticket).toBeDefined();
      expect(order.ticket.id).toEqual(ticketId);
    });

    test.todo('emits an order cancelled event.');
  });
  describe('[ERROR]:', () => {
    test('[401] The user is unauthorized:', async () => {
      const res = await query(routerUrl.getById('s'), 'get', {});
      ResErr(res, 401);
    });
    test('[400] The order id is invalid:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById('qwertyuiopas'), 'get', {}, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[404] the order is not exist', async () => {
      const id = createMongoId();
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById(id), 'get', {}, '', cookie);
      ResErr(res, 404, 'The Order is not exist');
    });

    test('[401] If the order does not belong to the user:', async () => {
      const ticket = await db.tickets.addition(ticketCreate);
      let id: string = createMongoId() as string;

      const { cookie } = await createCookie({ id, email: 'test@test.test' });
      const existOrder = await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
      const { body: bodyCreate } = existOrder;
      const { data: dataCreate } = bodyCreate;

      let idOtherUser: string = createMongoId() as string;
      const { cookie: cookieOtherUser } = await createCookie({ idOtherUser, email: 'test1@test.test' });

      const res = await query(routerUrl.delete(dataCreate.id), 'delete', {}, '', cookieOtherUser);

      ResErr(res, 401, 'Unauthorized');
    });
  });
});
