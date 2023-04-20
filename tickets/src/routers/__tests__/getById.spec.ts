import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };

describe('[Create]:', () => {
  describe('[OK]:', () => {
    let ticket: any = {};
    test('successful create:', async () => {
      const { cookie } = await createCookie();
      const ticketCreated = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const { data: ticketData } = ticketCreated.body;
      ResOK(ticketCreated, 201);

      const res = await query(routerUrl.getById(ticketData.id), 'post', ticketsCreate, '', cookie);
      ResOK(res, 201);
      const { body } = res;
      const { data } = body;
      ticket = data;
    });

    test('ticket is success:', async () => {
      expect(ticket.title).toBe(ticketsCreate.title);
    });
    test('price is success:', async () => {
      expect(ticket.price).toBe(ticketsCreate.price);
    });
    test('id is success:', async () => {
      console.dir(ticket.id);
      expect(ticket.id).toBeDefined();
    });
    test('userId is success:', async () => {
      expect(ticket.userId).toBeDefined();
    });
  });

  describe('[ERROR]:', () => {
    test('user is unauthorized:', async () => {
      const res = await query(routerUrl.getById('s'), 'post', ticketsCreate);
      ResErr(res, 401);
    });
    test('id is invalid:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById('qwertyuiopas'), 'post', {}, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('ticket is not exist', async () => {
      const { cookie } = await createCookie();
      await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const res = await query(routerUrl.getById('qwertyuiopas'), 'post', ticketsCreate, '', cookie);
      ResErr(res, 404, 'Ticket is not exist');
    });
  });
});
