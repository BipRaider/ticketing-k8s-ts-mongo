import { Document, Model, ObjectId } from 'mongoose';

export interface ITicketsAttr {
  title: string;
  price: number;
}

export interface Tickets extends ITicketsAttr {
  id: string;
}

export interface ITicketsSchema extends Document<ObjectId | string>, ITicketsAttr {
  readonly createAt?: Date;
  readonly updateAt?: Date;
  /*** Checking that the ticket is not already reserved.*/
  isReserved: () => Promise<boolean>;
}

export type TicketsCreate = Omit<Tickets, 'id'>;
export type TicketsUpdate = Omit<Tickets, 'id'>;
export type TTickets = Pick<ITicketsSchema, 'title' | 'price' | 'id'>;
export type TTicketsInstance = ITicketsSchema;

export interface ITicketsModel extends Model<TTicketsInstance> {
  /*** Create the ticket and save it to the database.*/
  addition: (date: ITicketsAttr) => Promise<TTicketsInstance>;
}
