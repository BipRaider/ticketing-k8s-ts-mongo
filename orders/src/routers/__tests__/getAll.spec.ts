import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };

describe('[GET ALL]:', () => {
  describe('[OK]:', () => {
    let ticket: any = {};
    test('[200] returns the tickets successfully:', async () => {
      const { cookie } = await createCookie();
      const ticketCreated = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResOK(ticketCreated, 201);

      const res = await query(routerUrl.getAll, 'get', ticketsCreate, '', cookie);
      ResOK(res, 200);
      const { body } = res;
      const { data } = body;
      ticket = data[0];
    });

    test('returns the title valid:', () => {
      expect(ticket.title).toBe(ticketsCreate.title);
    });
    test('returns the price valid:', () => {
      expect(ticket.price).toBe(ticketsCreate.price);
    });
    test('returns correct id:', () => {
      expect(ticket.id).toBeDefined();
    });
    test('returns correct userId:', () => {
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
