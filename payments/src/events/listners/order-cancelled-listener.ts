import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, Subjects, Listener, OrdersStatus } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListenerEvent extends Listener<OrderCancelledEvent> {
  override subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const order = await this.DB.orders.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw Error('Order not found.');

    order.set({ status: OrdersStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
