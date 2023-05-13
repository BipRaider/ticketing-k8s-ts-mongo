import { Subjects } from '../subjects';
import { OrdersStatus } from './order';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;

  data: {
    id: string;
    userId: string;
    status: OrdersStatus;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}
