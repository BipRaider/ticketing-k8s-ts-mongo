import { ExpirationCompleteEvent, Subjects, Publisher } from '@bipdev/contracts';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  override subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
