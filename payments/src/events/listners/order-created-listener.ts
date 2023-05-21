import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, Listener } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListenerEvent extends Listener<OrderCreatedEvent> {
  override subject: Subjects.OrderCreated = Subjects.OrderCreated;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    await this.DB.orders.addition({
      id: data.id,
      status: data.status,
      version: data.version,
      userId: data.userId,
      price: data?.ticket.price,
    });

    msg.ack();
  }
}
