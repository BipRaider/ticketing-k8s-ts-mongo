import { Schema, model } from 'mongoose';
import { OrdersStatus } from '@bipdev/contracts';

import { DB_Module, MongoService } from '@src/database';
import { ITicketsAttr, ITicketsModel, ITicketsSchema, TTicketsInstance } from '@src/interfaces';

const TicketsSchema = new Schema<ITicketsSchema, ITicketsModel>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toJSON: {
      transform: (_doc, ret: ITicketsSchema): void => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  },
);

TicketsSchema.statics.addition = async (date: ITicketsAttr): Promise<TTicketsInstance> => {
  const item: TTicketsInstance = new TicketsModel({ title: date.title, price: date.price });
  return await item.save();
};

TicketsSchema.methods.isReserved = async function (): Promise<boolean> {
  const DB = new MongoService().orders;
  const existingOrder = await DB.findOne({
    ticket: this,
    status: {
      $in: [OrdersStatus.Created, OrdersStatus.AwaitingPayment, OrdersStatus.Complete],
    },
  }).exec();

  return !!existingOrder;
};

export const TicketsModel: ITicketsModel = model<TTicketsInstance, ITicketsModel>(
  DB_Module.TICKET,
  TicketsSchema,
  DB_Module.TICKETS,
);
