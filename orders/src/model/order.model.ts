import { Schema, model } from 'mongoose';

import { DB_Module } from '@src/database';
import { IOrdersAttr, IOrdersModel, IOrdersSchema, TOrdersInstance } from '@src/interfaces';

const OrdersSchema = new Schema<IOrdersSchema, IOrdersModel>(
  {
    status: { type: String, required: true },
    userId: { type: String, required: true },
    expiresAt: { type: Schema.Types.Date },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toJSON: {
      transform: (_doc, ret: IOrdersSchema): void => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  },
);

OrdersSchema.statics['addition'] = async function (date: IOrdersAttr): Promise<TOrdersInstance> {
  const item: TOrdersInstance = new OrdersModel({
    status: date.status,
    expiresAt: date.expiresAt,
    userId: date.userId,
    ticket: date.ticket,
  });

  return item.save();
};

export const OrdersModel: IOrdersModel = model<TOrdersInstance, IOrdersModel>(
  DB_Module.ORDER,
  OrdersSchema,
  DB_Module.ORDERS,
);
