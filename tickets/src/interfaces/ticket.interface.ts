import { Document, Model, ObjectId } from 'mongoose';

export interface ITicketsAttr {
  email: string;
  password: string;
}

export interface Tickets extends ITicketsAttr {
  id: string;
}

export interface ITicketsSchema extends Document<ObjectId | string>, ITicketsAttr {
  readonly createAt?: Date;
  readonly updateAt?: Date;
}

export type TicketsSignUp = Omit<Tickets, 'id'>;
export type TicketsSignIn = Omit<Tickets, 'id'>;
export type TTickets = Pick<ITicketsSchema, 'email' | 'password' | '_id'>;
export type TTicketsInstance = ITicketsSchema;

export interface ITicketsModel extends Model<TTicketsInstance> {
  addition: (date: ITicketsAttr) => Promise<TTicketsInstance>;
}
