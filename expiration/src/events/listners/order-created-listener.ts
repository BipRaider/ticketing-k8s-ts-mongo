import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, Listener } from '@bipdev/contracts';
// import { TicketUpdatePublisher } from '@src/events';

import { queueGroupName } from './queue-group-name';

export class OrderCreatedListenerEvent extends Listener<OrderCreatedEvent> {
  override subject: Subjects.OrderCreated = Subjects.OrderCreated;
  override queueGroupName: string = queueGroupName;

  override async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    console.dir(data);

    msg.ack();
  }
}
