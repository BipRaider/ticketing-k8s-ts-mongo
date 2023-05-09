import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie, createMongoId } from '../../test/utils';

const ticketsCreate = { title: 'first ticket', price: 100 };

describe('[GET BY ID]:', () => {
  // describe('[OK]:', () => {
  //   let ticket: any = {};
  //   test('[200] returns the ticket successfully:', async () => {
  //     const { cookie } = await createCookie();
  //     const ticketCreated = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
  //     const { data: ticketData } = ticketCreated.body;
  //     ResOK(ticketCreated, 201);
  //     const res = await query(routerUrl.getById(ticketData.id), 'get', ticketsCreate, '', cookie);
  //     ResOK(res, 200);
  //     const { body } = res;
  //     const { data } = body;
  //     ticket = data;
  //   });
  //   test('returns the title valid:', () => {
  //     expect(ticket.title).toBe(ticketsCreate.title);
  //   });
  //   test('returns the price valid:', () => {
  //     expect(ticket.price).toBe(ticketsCreate.price);
  //   });
  //   test('returns correct id:', () => {
  //     expect(ticket.id).toBeDefined();
  //   });
  //   test('returns correct userId:', () => {
  //     expect(ticket.userId).toBeDefined();
  //   });
  // });
  // describe('[ERROR]:', () => {
  //   test('[401] user is unauthorized:', async () => {
  //     const res = await query(routerUrl.getById('s'), 'get', {});
  //     ResErr(res, 401);
  //   });
  //   test('[400] id is invalid:', async () => {
  //     const { cookie } = await createCookie();
  //     const res = await query(routerUrl.getById('qwertyuiopas'), 'get', {}, '', cookie);
  //     ResErr(res, 400, 'Invalid credentials');
  //   });
  //   test('[404] ticket is not exist', async () => {
  //     const id = createMongoId();
  //     const { cookie } = await createCookie();
  //     const res = await query(routerUrl.getById(id), 'get', {}, '', cookie);
  //     ResErr(res, 404, 'Ticket is not exist');
  //   });
  // });
});
