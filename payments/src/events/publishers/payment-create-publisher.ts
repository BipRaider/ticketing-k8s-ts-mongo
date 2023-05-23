import { PaymentCreatedEvent, Subjects, Publisher } from '@bipdev/contracts';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  override subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
