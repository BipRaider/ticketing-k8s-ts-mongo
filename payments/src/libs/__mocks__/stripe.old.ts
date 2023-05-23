import { jest } from '@jest/globals';
// import Stripe from 'stripe';

// type MockPublish = (
//   params?: Stripe.ChargeCreateParams,
//   options?: Stripe.RequestOptions,
// ) => Promise<Stripe.Response<Stripe.Charge>>;

// type MockPublishCreate = { receipt_url: string };
export const stripe = {
  charges: {
    // @ts-ignore
    create: jest.fn().mockResolvedValue({}),
  },
};
