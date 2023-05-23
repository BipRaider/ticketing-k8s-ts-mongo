import { Document, Model, ObjectId } from 'mongoose';

export interface IPaymentsAttr {
  version: number;
  userId: string;
  price: number;
}

export interface Payment extends IPaymentsAttr {
  id: string;
}

export interface IPaymentsDoc extends Document<ObjectId | string>, IPaymentsAttr {
  version: number;
  readonly createAt?: Date;
  readonly updateAt?: Date;
}

export type TPayments = Pick<IPaymentsDoc, 'price' | 'id' | 'userId' | 'version'>;
export type IPaymentsSchema = IPaymentsDoc;

export interface IPaymentsModel extends Model<IPaymentsSchema> {
  /*** Create the ticket and save it to the database.*/
  addition: (date: Payment) => Promise<IPaymentsSchema>;
}
