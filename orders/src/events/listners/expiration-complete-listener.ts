import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, Subjects, Listener, OrdersStatus } from '@bipdev/contracts';
import { DB_Module, MongoService } from '@src/database';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers';

export class ExpirationCompleteListenerEvent extends Listener<ExpirationCompleteEvent> {
  override subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  override queueGroupName: string = queueGroupName;

  public DB: MongoService = new MongoService();

  override async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
    const order = await this.DB.orders.findById(data.orderId).populate(DB_Module.TICKET);

    if (!order) throw new Error('Order not found');

    order.set({ status: OrdersStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
