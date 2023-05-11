import { Subjects } from '../subjects';
import { OrdersStatus } from './order';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;

  data: {
    id: string;
    userId: string;
    status: OrdersStatus;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
