import { Publisher } from '@bipdev/common';
import { TicketCreatedEvent, Subjects } from '@bipdev/contracts';

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
  override subject: Subjects.TicketCreated;
}
