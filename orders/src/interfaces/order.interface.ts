import { Document, Model, ObjectId } from 'mongoose';
import { OrdersStatus } from '@bipdev/contracts';
import { ITicketsSchema } from './ticket.interface';

export interface IOrdersAttr {
  expiresAt: Date;
  status: OrdersStatus;
  userId: string;
  ticket: ITicketsSchema;
}

export interface Orders extends IOrdersAttr {
  id: string;
}

export interface IOrdersSchema extends Document<ObjectId | string>, IOrdersAttr {
  version: number;
  readonly createAt?: Date;
  readonly updateAt?: Date;
}
export type TOrders = Pick<IOrdersSchema, 'id' | 'expiresAt' | 'status' | 'userId' | 'ticket'>;

export type OrdersCreate = Omit<Orders, 'id'>;
export type TOrdersInstance = IOrdersSchema;

export interface IOrdersModel extends Model<TOrdersInstance> {
  /*** Create the order and save it to the database.*/
  addition: (date: IOrdersAttr) => Promise<TOrdersInstance>;
}
