import { describe, test, expect } from '@jest/globals';
import { query, ResErr, ResOK, routerUrl, createCookie, createMongoId } from '../../test/utils';
import { natsWrapper } from '../../events/nats-wrapper';
import { OrdersStatus } from '@bipdev/contracts';

const ticketsCreate = { ticketId: createMongoId() };

describe('[Create]:', () => {
  describe('[OK]:', () => {
    let order: any = {};
    test('[201] create the order successfully:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResOK(res, 201);
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
    test('returns the ticket valid:', () => {
      expect(order.ticket).toBeDefined();
    });
    test('returns correct id:', () => {
      expect(order.id).toBeDefined();
    });
    test('returns correct userId:', () => {
      expect(order.userId).toBeDefined();
    });
    // test('[201] Check publisher an event :', async () => {
    //   const { cookie } = await createCookie();
    //   const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
    //   ResOK(res, 201);
    //   expect(natsWrapper.client.publish).toHaveBeenCalled();
    // });
  });
  describe('[ERROR]:', () => {
    test('[401] user is unauthorized:', async () => {
      const res = await query(routerUrl.create, 'post', ticketsCreate);
      ResErr(res, 401);
    });
    test('[400] missing data of a ticketId:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { ticketId: '', price: '' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[400] invalid data of a ticketId:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { ticketId: 'sdfsdf' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[404] the ticket does not exist:', async () => {
      const { cookie } = await createCookie();
      await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResErr(res, 404, 'Ticket is not exist');
    });
    test('[400] the ticket is already reserved:', async () => {
      const { cookie } = await createCookie();
      await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', ticketsCreate, '', cookie);
      ResErr(res, 400, 'Ticket is already reserved.');
    });
  });
});
