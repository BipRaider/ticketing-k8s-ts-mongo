import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, Listener } from '@bipdev/contracts';

import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../queues';

export class OrderCreatedListenerEvent extends Listener<OrderCreatedEvent> {
  override subject: Subjects.OrderCreated = Subjects.OrderCreated;
  override queueGroupName: string = queueGroupName;

  override async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );

    msg.ack();
  }
}
