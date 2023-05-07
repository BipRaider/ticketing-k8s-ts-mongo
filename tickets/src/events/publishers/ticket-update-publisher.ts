import { Publisher } from '@bipdev/common';
import { TicketUpdatedEvent, Subjects } from '@bipdev/contracts';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  override subject: Subjects.TicketUpdated;
}
