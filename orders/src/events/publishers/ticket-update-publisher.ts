import { TicketUpdatedEvent, Subjects, Publisher } from '@bipdev/contracts';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  override subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
