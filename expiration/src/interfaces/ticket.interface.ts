import { Document, Model, ObjectId } from 'mongoose';

export interface ITicketsAttr {
  title: string;
  price: number;
  /*** The user id that crated the ticket. */
  userId: string;
  /** The order id that reserved the ticket. */
  orderId?: string;
}

export interface Tickets extends ITicketsAttr {
  id: string;
}

export interface ITicketsSchema extends Document<ObjectId | string>, ITicketsAttr {
  readonly createAt?: Date;
  readonly updateAt?: Date;
  version: number;
}

export type TicketsCreate = Omit<Tickets, 'id'>;
export type TicketsUpdate = Omit<Tickets, 'id'>;
export type TTickets = Pick<ITicketsSchema, 'title' | 'price' | 'id' | 'userId' | 'orderId'>;
export type TTicketsInstance = ITicketsSchema;

export interface ITicketsModel extends Model<TTicketsInstance> {
  addition: (date: ITicketsAttr) => Promise<TTicketsInstance>;
}
