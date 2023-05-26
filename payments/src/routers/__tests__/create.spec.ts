import { describe, test, expect, jest } from '@jest/globals';
import { OrdersStatus, PaymentCreatedEvent, Subjects } from '@bipdev/contracts';

import { query, ResErr, routerUrl, createCookie, createMongoId } from '../../test/utils';

import { stripe } from '../../libs';
import { MongoService } from '../../database';
import { IPaymentsSchema } from '../../interfaces';
import { natsWrapper } from '../../events/nats-wrapper';

const orderCreate = { token: 'tok_visa', orderId: createMongoId() };

const orderAttr = (userId: string) => ({
  id: orderCreate.orderId,
  version: 0,
  userId,
  price: Math.floor(Math.random() * 1000),
  status: OrdersStatus.Created,
});

const db: MongoService = new MongoService();

describe('[Create]:', () => {
  describe('[OK]:', () => {
    let publisherCalls: unknown[];
    let publisherData: PaymentCreatedEvent['data'];
    test('[201] create the order successfully and a publisher event is called:', async () => {
      const userId = createMongoId();
      const email = 'test@test.test';
      const { cookie } = await createCookie({ id: userId, email });
      const orderData = orderAttr(userId);
      await db.orders.addition(orderData);
      const res = await query(routerUrl.create, 'post', orderCreate, '', cookie);

      expect(res.statusCode).toEqual(201);
      expect(natsWrapper.client.publish).toHaveBeenCalled();
      publisherCalls = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
      publisherData = JSON.parse(publisherCalls[1] as string);
    });
    describe('[Publisher event]', () => {
      test('subject should be valid', () => {
        expect(publisherCalls[0]).toEqual(Subjects.PaymentCreated);
      });
      test('orderId should be valid', () => {
        expect(publisherData.orderId).toBeDefined();
        expect(publisherData.orderId).toEqual(orderCreate.orderId);
      });
      test('payment id should be define', () => {
        expect(publisherData.id).toBeDefined();
      });
      test('stripeId should be define', () => {
        expect(publisherData.stripeId).toBeDefined();
      });
    });

    describe('[Stripe]', () => {
      let charge: any;
      let paymentOrder: IPaymentsSchema;
      test('payment and stripe should be define', async () => {
        try {
          const userId = createMongoId();
          const email = 'test@test.test';
          const { cookie } = await createCookie({ id: userId, email });
          const orderData = orderAttr(userId);
          await db.orders.addition(orderData);
          await query(routerUrl.create, 'post', orderCreate, '', cookie);

          const charges = await stripe.charges.list({ limit: 50 });

          charge = charges.data.find(ch => {
            return ch.amount === orderData.price * 100;
          });

          expect(charge).toBeDefined();

          paymentOrder = await db.payments.findOne({
            stripeId: charge!.id,
            orderId: orderCreate.orderId,
          });

          expect(paymentOrder).toBeDefined();
          expect(paymentOrder).not.toBeNull();
        } catch (error) {
          expect(error).not.toBeDefined();
        }
      });

      test('charge currency should be correct', () => {
        expect(charge.currency).toEqual('usd');
      });
      test('stripeId should be valid into the payment', () => {
        expect(paymentOrder.stripeId).toEqual(charge!.id);
      });
      test('orderId should be valid into the payment', () => {
        expect(paymentOrder.orderId).toEqual(orderCreate.orderId);
      });

      // let stripeCalls: any = {};
      // let stripeData: any = {};
      // test('stripe should be called:', async () => {
      //   const userId = createMongoId();
      //   const email = 'test@test.test';
      //   const { cookie } = await createCookie({ id: userId, email });
      //   const orderData = orderAttr(userId);
      //   await db.orders.addition(orderData);
      //   await query(routerUrl.create, 'post', orderCreate, '', cookie);

      //   expect(stripe.charges.create).toHaveBeenCalled();
      //   stripeCalls = (stripe.charges.create as jest.Mock).mock.calls[0];
      //   stripeData = stripeCalls[0];
      // });

      // test('amount should be correct', () => {
      //   expect(stripeData.amount).toEqual(10 * 100);
      // });
      // test('currency should be correct', () => {
      //   expect(stripeData.currency).toEqual('usd');
      // });
      // test('token should be correct', () => {
      //   expect(stripeData.source).toEqual(orderCreate.token);
      // });
    });
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
