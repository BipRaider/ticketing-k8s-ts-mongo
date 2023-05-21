import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie, createMongoId } from '../../test/utils';
import { OrdersStatus } from '@bipdev/contracts';

import { MongoService } from '../../database';

const db: MongoService = new MongoService();

const ticketCreate = { title: 'concert', price: 10, id: createMongoId() };

describe('[GET BY ID]:', () => {
  // test.todo('Need an implementation works of the getById func');
  describe('[OK]:', () => {
    let order: any = {};
    let id: string = createMongoId() as string;
    let ticketId: string = '';

    test('[200] create the order and got one of the order by id:', async () => {
      const ticket = await db.tickets.addition(ticketCreate);
      ticketId = ticket.id;

      const { cookie } = await createCookie({ id, email: 'test@test.test' });
      const existOrder = await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);

      const { body: bodyCreate } = existOrder;
      const { data: dataCreate } = bodyCreate;

      const res = await query(routerUrl.getById(dataCreate.id), 'get', {}, '', cookie);

      ResOK(res, 200);

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
    test('returns the ticket.version valid:', () => {
      expect(order.ticket.version).toEqual(0);
    });
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

      const res = await query(routerUrl.getById(dataCreate.id), 'get', {}, '', cookieOtherUser);

      ResErr(res, 401, 'Unauthorized');
    });
  });
});
