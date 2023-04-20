import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };

describe('[Create]:', () => {
  describe('[OK]:', () => {
    let ticket: any = {};
    test('successful create:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResOK(res, 201);
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
      const res = await query(routerUrl.create, 'post', ticketsCreate);
      ResErr(res, 401);
    });
    test('[400] the ticket is exist:', async () => {
      const { cookie } = await createCookie();
      await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResErr(res, 400, 'Ticket exist');
    });
    test('[400] missing data of a title and price:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { title: '', price: '' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] missing data of a title:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { title: '', price: ticketsCreate.price }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[400] invalid data of a title:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { title: '1', price: ticketsCreate.price }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] invalid data of a longer length title:', async () => {
      const { cookie } = await createCookie();
      const res = await query(
        routerUrl.create,
        'post',
        { title: '11111111111111111111111111111111asdasdasdasdasdasd', price: ticketsCreate.price },
        '',
        cookie,
      );
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] missing data of a price:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { title: ticketsCreate.title, price: '' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] invalid data of a length less price:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { title: ticketsCreate.title, price: -1 }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] invalid data of a longer length price:', async () => {
      const { cookie } = await createCookie();
      const res = await query(
        routerUrl.create,
        'post',
        {
          title: ticketsCreate.title,
          price: 1111111111111,
        },
        '',
        cookie,
      );

      ResErr(res, 400, 'Invalid credentials');
    });
  });
});
