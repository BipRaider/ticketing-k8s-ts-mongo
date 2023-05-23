import { Message } from 'node-nats-streaming';
import { PaymentCreatedEvent, Subjects, Listener, OrdersStatus } from '@bipdev/contracts';
import { MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListenerEvent extends Listener<PaymentCreatedEvent> {
  override subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
    const order = await this.DB.orders.findById(data.orderId);

    if (!order) throw new Error('Order not found');

    order.set({ status: OrdersStatus.Complete });

    await order.save();

    msg.ack();
  }
}
