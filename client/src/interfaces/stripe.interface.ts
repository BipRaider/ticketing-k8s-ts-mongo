import { Token, Card } from 'react-stripe-checkout';

export interface StripeCard extends Token {
  id: string;
  object: string;
  card: Card;
  client_ip: string;
  created: number;
  email: string;
  livemode: boolean;
  type: string;
}
