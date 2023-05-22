import { describe, test, expect } from '@jest/globals';
import { OrdersStatus } from '@bipdev/contracts';

import { query, ResErr, ResOK, routerUrl, createCookie, createMongoId } from '../../test/utils';

import { natsWrapper } from '../../events/nats-wrapper';
import { MongoService } from '../../database';

const orderCreate = { token: 'concert', orderId: createMongoId() };

const orderAttr = (userId: string) => ({
  id: orderCreate.orderId,
  version: 0,
  userId,
  price: 10,
  status: OrdersStatus.Created,
});

const db: MongoService = new MongoService();

describe('[Create]:', () => {
  describe('[OK]:', () => {
    let order: any = {};
    let user: any = '';
    let price: number;
    test('[201] create the order successfully:', async () => {
      const userId = createMongoId();
      const email = 'test@test.test';
      user = userId;
      const { cookie } = await createCookie({ id: userId, email });

      const orderData = orderAttr(userId);
      price = orderData.price;
      await db.orders.addition(orderData);

      const res = await query(routerUrl.create, 'post', orderCreate, '', cookie);
      ResOK(res, 201);
      const { body } = res;
      const { data } = body;
      order = data;
    });
    test('returns the status valid:', () => {
      expect(order.status).toBeDefined();
      expect(order.status).toEqual(OrdersStatus.Created);
    });

    test('returns correct orderId:', () => {
      expect(order.id).toEqual(orderCreate.orderId);
    });
    test('returns correct userId:', () => {
      expect(order.userId).toBeDefined();
      expect(order.userId).toEqual(user);
    });

    test('returns correct price:', () => {
      expect(order.price).toBeDefined();
      expect(order.price).toEqual(price);
    });
    // test.todo('emits an order created event');
    // test('[201] Check publisher an event :', async () => {
    //   const ticket = await db.orders.addition(ticketCreate);
    //   const { cookie } = await createCookie();
    //   const res = await query(routerUrl.create, 'post', { ticketId: ticket.id }, '', cookie);
    //   ResOK(res, 201);
    //   expect(natsWrapper.client.publish).toHaveBeenCalled();
    // });
  });
  describe('[ERROR]:', () => {
    test('[401] user is unauthorized:', async () => {
      const res = await query(routerUrl.create, 'post', orderCreate);
      ResErr(res, 401);
    });
    test('[400] missing data of a orderId:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { orderId: '', token: orderCreate.token }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[400] invalid data of a orderId:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { orderId: 'sdfsdf', token: orderCreate.token }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[400] missing data of a token:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { orderId: orderCreate.orderId }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[400] invalid data of a token:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.create, 'post', { orderId: orderCreate.orderId, token: '' }, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });

    test('[404] the order does not exist:', async () => {
      const { cookie } = await createCookie();
      await query(routerUrl.create, 'post', orderCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', orderCreate, '', cookie);
      ResErr(res, 404, 'The order is not exist');
    });

    test('[401] the user is not owner of the order:', async () => {
      const userId = createMongoId();

      await db.orders.addition(orderAttr(userId));

      const { cookie } = await createCookie();

      await query(routerUrl.create, 'post', orderCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', orderCreate, '', cookie);
      ResErr(res, 401, 'Unauthorized');
    });
    test('[400] cannot pay for an cancelled order:', async () => {
      const userId = createMongoId();
      const email = 'test@test.test';

      const { cookie } = await createCookie({ id: userId, email });

      const order = await db.orders.addition(orderAttr(userId));
      order.set({ status: OrdersStatus.Cancelled });
      await order.save();

      await query(routerUrl.create, 'post', orderCreate, '', cookie);
      const res = await query(routerUrl.create, 'post', orderCreate, '', cookie);
      ResErr(res, 400, 'Cannot pay for an cancelled order');
    });
  });
});
