import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };

describe('[GET ALL]:', () => {
  describe('[OK]:', () => {
    let ticket: any = {};
    test('successful create:', async () => {
      const { cookie } = await createCookie();
      const ticketCreated = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResOK(ticketCreated, 201);

      const res = await query(routerUrl.getAll, 'get', ticketsCreate, '', cookie);
      ResOK(res, 200);
      const { body } = res;
      const { data } = body;
      ticket = data[0];
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
      const res = await query(routerUrl.getAll, 'get', ticketsCreate);
      ResErr(res, 401);
    });
  });
});
