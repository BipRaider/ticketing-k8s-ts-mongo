import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, Subjects, Listener } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListenerEvent extends Listener<OrderCancelledEvent> {
  override subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    console.dir(data);
    msg.ack();
  }
}
