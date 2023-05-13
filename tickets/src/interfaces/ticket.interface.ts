import { Document, Model, ObjectId } from 'mongoose';

export interface ITicketsAttr {
  title: string;
  price: number;
  userId: string;
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
export type TTickets = Pick<ITicketsSchema, 'title' | 'price' | '_id' | 'id' | 'userId'>;
export type TTicketsInstance = ITicketsSchema;

export interface ITicketsModel extends Model<TTicketsInstance> {
  addition: (date: ITicketsAttr) => Promise<TTicketsInstance>;
}
