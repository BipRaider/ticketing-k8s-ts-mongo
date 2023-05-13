import { Document, Model, ObjectId } from 'mongoose';

export interface ITicketsAttr {
  title: string;
  price: number;
}

export interface Tickets extends ITicketsAttr {
  id: string;
}

export interface ITicketsSchema extends Document<ObjectId | string>, ITicketsAttr {
  version: number;
  readonly createAt?: Date;
  readonly updateAt?: Date;
  /*** Checking that the ticket is not already reserved.*/
  isReserved: () => Promise<boolean>;
}

export type TTickets = Pick<ITicketsSchema, 'title' | 'price' | 'id'>;
export type TTicketsInstance = ITicketsSchema;

export interface ITicketsModel extends Model<TTicketsInstance> {
  /*** Create the ticket and save it to the database.*/
  addition: (date: Tickets) => Promise<TTicketsInstance>;
  /*** Find of the ticket by id and version to the database.*/
  findByVersion: (data: { id: string; version: number }) => Promise<TTicketsInstance | null>;
}
