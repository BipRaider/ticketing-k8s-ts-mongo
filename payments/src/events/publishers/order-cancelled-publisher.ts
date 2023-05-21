import { OrderCancelledEvent, Subjects, Publisher } from '@bipdev/contracts';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  override subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
