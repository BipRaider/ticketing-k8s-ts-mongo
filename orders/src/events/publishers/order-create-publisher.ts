import { OrderCreatedEvent, Subjects, Publisher } from '@bipdev/contracts';

export class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
  override subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
