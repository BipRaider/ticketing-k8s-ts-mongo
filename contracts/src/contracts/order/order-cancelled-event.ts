import { Subjects } from '../subjects';
import { OrdersStatus } from './order';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;

  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
