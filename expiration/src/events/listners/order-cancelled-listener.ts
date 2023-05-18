import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, Subjects, Listener } from '@bipdev/contracts';

// import { TicketUpdatePublisher } from '@src/events';

import { queueGroupName } from './queue-group-name';

export class OrderCancelledListenerEvent extends Listener<OrderCancelledEvent> {
  override subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  override queueGroupName: string = queueGroupName;

  override async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    console.dir(data);

    msg.ack();
  }
}
