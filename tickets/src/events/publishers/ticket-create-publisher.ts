import { TicketCreatedEvent, Subjects, Publisher } from '@bipdev/contracts';

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
  override subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
