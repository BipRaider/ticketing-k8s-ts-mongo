import { describe, test, expect, jest } from '@jest/globals';
import { OrdersStatus } from '@bipdev/contracts';

import { query, ResErr, routerUrl, createCookie, createMongoId, StatusIsNot } from '../../test/utils';

import { stripe } from '../../libs';
import { MongoService } from '../../database';

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
    test('[204] create the order successfully:', async () => {
      const userId = createMongoId();
      const email = 'test@test.test';
      const { cookie } = await createCookie({ id: userId, email });
      const orderData = orderAttr(userId);
      await db.orders.addition(orderData);
      const res = await query(routerUrl.create, 'post', orderCreate, '', cookie);

      expect(res.statusCode).toEqual(204);
    });
    describe('Stripe', () => {
      test('stripe should be called:', async () => {
        const userId = createMongoId();
        const email = 'test@test.test';
        const { cookie } = await createCookie({ id: userId, email });
        const orderData = orderAttr(userId);
        await db.orders.addition(orderData);
        await query(routerUrl.create, 'post', orderCreate, '', cookie);

        const charges = await stripe.charges.list({ limit: 50 });
        const charge = charges.data.find(ch => {
          return ch.amount === orderData.price * 100;
        });

        expect(charge).toBeDefined();
        expect(charge?.currency).toEqual('usd');
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

//const charge = {
//     id: 'ch_3NAranAxjIq1CWiV0NUDpXdH',
//     object: 'charge',
//     amount: 78400,
//     amount_captured: 78400,
//     amount_refunded: 0,
//     application: null,
//     application_fee: null,
//     application_fee_amount: null,
//     balance_transaction: 'txn_3NAranAxjIq1CWiV0vhPIMuz',
//     billing_details: {
//       address: {
//         city: null,
//         country: null,
//         line1: null,
//         line2: null,
//         postal_code: null,
//         state: null
//       },
//       email: null,
//       name: null,
//       phone: null
//     },
//     calculated_statement_descriptor: 'Stripe',
//     captured: true,
//     created: 1684834401,
//     currency: 'usd',
//     customer: null,
//     description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
//     destination: null,
//     dispute: null,
//     disputed: false,
//     failure_balance_transaction: null,
//     failure_code: null,
//     failure_message: null,
//     fraud_details: {},
//     invoice: null,
//     livemode: false,
//     metadata: {},
//     on_behalf_of: null,
//     order: null,
//     outcome: {
//       network_status: 'approved_by_network',
//       reason: null,
//       risk_level: 'normal',
//       risk_score: 45,
//       seller_message: 'Payment complete.',
//       type: 'authorized'
//     },
//     paid: true,
//     payment_intent: null,
//     payment_method: 'card_1NAranAxjIq9CWiVRWC1Tj7D',
//     payment_method_details: {
//       card: {
//         brand: 'visa',
//         checks: [Object],
//         country: 'US',
//         exp_month: 5,
//         exp_year: 2024,
//         fingerprint: 'a8fkd51Y93LtyWxa',
//         funding: 'credit',
//         installments: null,
//         last4: '4242',
//         mandate: null,
//         network: 'visa',
//         network_token: [Object],
//         three_d_secure: null,
//         wallet: null
//       },
//       type: 'card'
//     },
//     receipt_email: null,
//     receipt_number: null,
//     receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTkFVNk5BeGpJcTlDV2lWKOKQsqMGMgZwZ78JIgs1LBbvk32ijeAZzILdWPqcpARARQ8jcoeH9Lidw4Y9f7nHPaQhzlS6o6unUOFq',
//     refunded: false,
//     review: null,
//     shipping: null,
//     source: {
//       id: 'card_1NAranAxjIq9CWiVRWC8Tj7D',
//       object: 'card',
//       address_city: null,
//       address_country: null,
//       address_line1: null,
//       address_line1_check: null,
//       address_line2: null,
//       address_state: null,
//       address_zip: null,
//       address_zip_check: null,
//       brand: 'Visa',
//       country: 'US',
//       customer: null,
//       cvc_check: null,
//       dynamic_last4: null,
//       exp_month: 5,
//       exp_year: 2024,
//       fingerprint: 'a1fkd51Y93LtyWxT',
//       funding: 'credit',
//       last4: '4242',
//       metadata: {},
//       name: null,
//       tokenization_method: null,
//       wallet: null
//     },
//     source_transfer: null,
//     statement_descriptor: null,
//     statement_descriptor_suffix: null,
//     status: 'succeeded',
//     transfer_data: null,
//     transfer_group: null
//   }
