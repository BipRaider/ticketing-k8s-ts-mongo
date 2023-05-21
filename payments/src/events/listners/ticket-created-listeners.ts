import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent, Subjects, Listener } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListenerEvent extends Listener<TicketCreatedEvent> {
  override subject: Subjects.TicketCreated = Subjects.TicketCreated;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    await this.DB.tickets.addition(data);

    msg.ack();
  }
}
