import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent, Subjects, Listener } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListenerEvent extends Listener<TicketUpdatedEvent> {
  override subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const ticket = await this.DB.tickets.findByVersion(data);

    if (!ticket) throw new Error('Ticket not found');

    const { price, title } = data;
    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}
