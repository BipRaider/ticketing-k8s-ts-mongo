import Stripe from 'stripe';

const testStripeKey =
  'sk_test_51NAU6NAxjIq9CWiVlhhAfaNDXN9sWOCJchZVj7NAiH3o9yz3cd9SzSYZ8hAbTMKgkWUHNvc5DT5NBQwzTSf6z62300KrFDl5kR';

export const stripe = new Stripe(process.env.STRIPE_KEY || testStripeKey, {
  apiVersion: '2022-11-15',
});
