import { describe, test, expect } from '@jest/globals';
import { Types } from 'mongoose';

import { query, ResErr, routerUrl, createCookie, ResOK } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };
const ticketsUpdate = { title: 'update ticket', price: 300 };

const getIdTicket = async (): Promise<{ id: string; cookie: string[] }> => {
  const { cookie } = await createCookie();
  const ticketCreated = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
  const { data: ticketData } = ticketCreated.body;
  ResOK(ticketCreated, 201);
  return { id: ticketData.id as string, cookie };
};

describe('[Update]:', () => {
  describe('[ERROR]:', () => {
    test('[401] user is unauthorized:', async () => {
      const res = await query(routerUrl.update('s'), 'put', ticketsCreate);
      ResErr(res, 401);
    });
    test('[400] id is invalid:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.update('qwertyuiopas'), 'put', ticketsCreate, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[404] ticket is not exist', async () => {
      const id = new Types.ObjectId().toHexString();
      const { cookie } = await createCookie();
      const res = await query(routerUrl.update(id), 'put', ticketsCreate, '', cookie);
      ResErr(res, 404, 'Ticket is not exist');
    });
    test('[401] the user is not own the ticket:', async () => {
      //  const res = await query(routerUrl.update('s'), 'put', ticketsCreate);
      //  ResErr(res, 401);
    });
    test('[400] the user is provides an missing price :', async () => {
      const { id, cookie } = await getIdTicket();
      const res = await query(routerUrl.update(id), 'put', { title: ticketsUpdate.title, price: '' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] the user is provides an missing title :', async () => {
      const { id, cookie } = await getIdTicket();
      const res = await query(routerUrl.update(id), 'put', { title: '', price: ticketsUpdate.price }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] the user is provides an invalid title :', async () => {
      const { id, cookie } = await getIdTicket();
      const res = await query(
        routerUrl.update(id),
        'put',
        { title: 'dasdasdasdasdasdaasdasdaasdasdasdadasd', price: ticketsUpdate.price },
        '',
        cookie,
      );
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] the user is provides an invalid price if less 0:', async () => {
      const { id, cookie } = await getIdTicket();
      const res = await query(routerUrl.update(id), 'put', { title: ticketsUpdate.title, price: -1 }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[400] the user is provides an invalid price if longer 1000:', async () => {
      const { id, cookie } = await getIdTicket();
      const res = await query(routerUrl.update(id), 'put', { title: ticketsUpdate.title, price: 11111 }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
  });
  describe('[OK]:', () => {
    let ticket: any = {};
    test('successful update:', async () => {
      const { id, cookie } = await getIdTicket();

      const res = await query(routerUrl.update(id), 'put', ticketsUpdate, '', cookie);
      ResOK(res, 200);
      const { body } = res;
      const { data } = body;
      ticket = data;
    });

    test('ticket is success:', () => {
      expect(ticket.title).toBe(ticketsUpdate.title);
    });
    test('price is success:', () => {
      expect(ticket.price).toBe(ticketsUpdate.price);
    });
    test('id is success:', () => {
      expect(ticket.id).toBeDefined();
    });
    test('userId is success:', () => {
      expect(ticket.userId).toBeDefined();
    });
  });
});
