import { describe, test, expect } from '@jest/globals';

import { query, ResErr, routerUrl, createCookie, ResOK, createMongoId } from '../../test/utils';
import { natsWrapper } from '../../events/nats-wrapper';

import { TicketsModel } from '../../model';
import { TTicketsInstance } from '../../interfaces';

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
      const id = createMongoId();
      const { cookie } = await createCookie();
      const res = await query(routerUrl.update(id), 'put', ticketsCreate, '', cookie);
      ResErr(res, 404, 'Ticket is not exist');
    });
    test('[401] the user is not own the ticket:', async () => {
      const userId = createMongoId();
      const { cookie } = await createCookie({ id: userId, email: 'test@test.test' });
      const { id } = await getIdTicket();
      const res = await query(routerUrl.update(id), 'put', ticketsUpdate, '', cookie);

      ResErr(res, 401);
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
    test('[400] Cannot edit the reserved ticket', async () => {
      const { id, cookie } = await getIdTicket();
      const ticket: TTicketsInstance = await TicketsModel.findById(id);
      ticket.set({ orderId: id });
      await ticket.save();
      const res = await query(routerUrl.update(id), 'put', { title: ticketsUpdate.title, price: 111 }, '', cookie);

      ResErr(res, 400, 'Cannot edit the reserved ticket');
    });
  });
  describe('[OK]:', () => {
    let ticket: any = {};
    test('[200] update the ticket successfully:', async () => {
      const { id, cookie } = await getIdTicket();

      const res = await query(routerUrl.update(id), 'put', ticketsUpdate, '', cookie);
      ResOK(res, 200);
      const { body } = res;
      const { data } = body;
      ticket = data;
    });

    test('returns the title valid, which is provided for the update:', () => {
      expect(ticket.title).toBe(ticketsUpdate.title);
    });
    test('returns the price valid, which is provided for the update:', () => {
      expect(ticket.price).toBe(ticketsUpdate.price);
    });
    test('returns correct id:', () => {
      expect(ticket.id).toBeDefined();
    });
    test('returns correct userId:', () => {
      expect(ticket.userId).toBeDefined();
    });

    test('returns the version 1:', () => {
      expect(ticket.version).toBeDefined();
      expect(ticket.version).toEqual(1);
    });
    test('[200] Check publisher an event :', async () => {
      const { id, cookie } = await getIdTicket();
      const res = await query(routerUrl.update(id), 'put', ticketsUpdate, '', cookie);
      ResOK(res, 200);

      expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
  });
});
