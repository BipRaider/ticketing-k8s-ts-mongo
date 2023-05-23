import { Document, Model, ObjectId } from 'mongoose';

export interface IPaymentsAttr {
  orderId: string;
  stripeId: string;
}

export interface Payment extends IPaymentsAttr {
  id: string;
}

export interface IPaymentsDoc extends Document<ObjectId | string>, IPaymentsAttr {
  readonly createAt?: Date;
  readonly updateAt?: Date;
}

export type TPayments = Pick<IPaymentsDoc, 'orderId' | 'id' | 'stripeId'>;
export type IPaymentsSchema = IPaymentsDoc;

export interface IPaymentsModel extends Model<IPaymentsSchema> {
  /*** Create the payment and save it to the database.*/
  addition: (date: IPaymentsAttr) => Promise<IPaymentsSchema>;
}
