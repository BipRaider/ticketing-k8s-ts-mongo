import { Document, Model, ObjectId } from 'mongoose';

import { OrdersStatus } from '@bipdev/contracts';

export interface IOrdersAttr {
  status: OrdersStatus;
  version: number;
  userId: string;
  price: number;
}

export interface Order extends IOrdersAttr {
  id: string;
}

export interface IOrdersDoc extends Document<ObjectId | string>, IOrdersAttr {
  version: number;
  readonly createAt?: Date;
  readonly updateAt?: Date;
}

export type TOrders = Pick<IOrdersDoc, 'price' | 'id' | 'userId' | 'status' | 'version'>;
export type IOrdersSchema = IOrdersDoc;

export interface IOrdersModel extends Model<IOrdersSchema> {
  /*** Create the ticket and save it to the database.*/
  addition: (date: Order) => Promise<IOrdersSchema>;
  /*** Find of the ticket by id and version to the database.*/
  findByVersion: (data: { id: string; version: number }) => Promise<IOrdersSchema | null>;
}
