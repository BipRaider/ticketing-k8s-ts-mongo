import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { DB_Module } from '@src/database';
import { ITicketsAttr, ITicketsModel, ITicketsSchema, TTicketsInstance } from '@src/interfaces';

mongoose.plugin(updateIfCurrentPlugin);

const TicketsSchema = new Schema<ITicketsSchema, ITicketsModel>(
  {
    title: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    orderId: { type: String },
  },
  {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toJSON: {
      transform: (_doc, ret: ITicketsSchema): void => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);
TicketsSchema.set('versionKey', 'version');

TicketsSchema.statics['addition'] = async function (date: ITicketsAttr): Promise<TTicketsInstance> {
  const item: TTicketsInstance = new TicketsModel({
    title: date.title,
    price: date.price,
    userId: date.userId,
  });

  return item.save();
};

export const TicketsModel: ITicketsModel = model<TTicketsInstance, ITicketsModel>(
  DB_Module.TICKET,
  TicketsSchema,
  DB_Module.TICKETS,
);
