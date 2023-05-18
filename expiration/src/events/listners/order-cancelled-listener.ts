import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, Subjects, Listener } from '@bipdev/contracts';

import { MongoService } from '@src/database';
import { TicketUpdatePublisher } from '@src/events';

import { queueGroupName } from './queue-group-name';

export class OrderCancelledListenerEvent extends Listener<OrderCancelledEvent> {
  override subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const ticket = await this.DB.tickets.findById(data?.ticket.id);

    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ orderId: undefined });

    await ticket.save();

    void new TicketUpdatePublisher(this.client).publish({
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      id: ticket.id,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
