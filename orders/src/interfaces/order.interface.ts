import { Document, Model, ObjectId } from 'mongoose';

export interface TicketDoc {}

export interface IOrdersAttr {
  expiresAt: Date;
  status: string;
  userId: string;
  ticket: TicketDoc;
}

export interface Orders extends IOrdersAttr {
  id: string;
}

export interface IOrdersSchema extends Document<ObjectId | string>, IOrdersAttr {
  readonly createAt?: Date;
  readonly updateAt?: Date;
}
export type TOrders = Pick<IOrdersSchema, 'expiresAt' | 'status' | '_id' | 'id' | 'userId' | 'ticket'>;

export type OrdersCreate = Omit<Orders, 'id'>;
export type TOrdersInstance = IOrdersSchema;

export interface IOrdersModel extends Model<TOrdersInstance> {
  addition: (date: IOrdersAttr) => Promise<TOrdersInstance>;
}
