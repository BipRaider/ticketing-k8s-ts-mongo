import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };

describe('[GET BY ID]:', () => {
  describe('[OK]:', () => {
    let ticket: any = {};
    test('successful create:', async () => {
      const { cookie } = await createCookie();
      const ticketCreated = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const { data: ticketData } = ticketCreated.body;
      ResOK(ticketCreated, 201);

      const res = await query(routerUrl.getById(ticketData.id), 'get', ticketsCreate, '', cookie);
      ResOK(res, 200);
      const { body } = res;
      const { data } = body;
      ticket = data;
    });

    test('ticket is success:', () => {
      expect(ticket.title).toBe(ticketsCreate.title);
    });
    test('price is success:', () => {
      expect(ticket.price).toBe(ticketsCreate.price);
    });
    test('id is success:', () => {
      expect(ticket.id).toBeDefined();
    });
    test('userId is success:', () => {
      expect(ticket.userId).toBeDefined();
    });
  });

  describe('[ERROR]:', () => {
    test('[401] user is unauthorized:', async () => {
      const res = await query(routerUrl.getById('s'), 'get', {});
      ResErr(res, 401);
    });
    test('[400] id is invalid:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById('qwertyuiopas'), 'get', {}, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[404] ticket is not exist', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById('64413d6d2ef980df596c0ddb'), 'get', {}, '', cookie);
      ResErr(res, 404, 'Ticket is not exist');
    });
  });
});
