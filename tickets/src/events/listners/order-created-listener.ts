import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, Listener } from '@bipdev/contracts';
import { TicketUpdatePublisher, natsWrapper } from '@src/events';

import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListenerEvent extends Listener<OrderCreatedEvent> {
  override subject: Subjects.OrderCreated = Subjects.OrderCreated;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const ticket = await this.DB.tickets.findById(data?.ticket.id);

    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ orderId: data.id });

    await ticket.save();

    const updateData = {
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      id: ticket.id,
    };

    void new TicketUpdatePublisher(natsWrapper.client).publish(updateData);

    msg.ack();
  }
}
