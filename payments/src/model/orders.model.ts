import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrdersStatus } from '@bipdev/contracts';

import { DB_Module } from '@src/database';
import { Order, IOrdersModel, IOrdersSchema, IOrdersDoc } from '@src/interfaces';

mongoose.plugin(updateIfCurrentPlugin);

const OrdersSchema = new Schema<IOrdersDoc, IOrdersModel>(
  {
    userId: { type: String, required: true },
    status: { type: String, enum: Object.values(OrdersStatus), required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toJSON: {
      transform: (_doc, ret: IOrdersSchema): void => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

OrdersSchema.set('versionKey', 'version');

OrdersSchema.statics.addition = async (date: Order): Promise<IOrdersSchema> => {
  const item: IOrdersSchema = new OrdersModel({
    _id: date.id,
    version: date.version,
    price: date.price,
    userId: date.userId,
    status: date.status,
  });
  return await item.save();
};

OrdersSchema.statics.findByVersion = async (data: { id: string; version: number }): Promise<IOrdersSchema | null> => {
  const version: number = data.version - 1;
  const ticket = await OrdersModel.findOne({ _id: data.id, version });
  return ticket;
};

export const OrdersModel: IOrdersModel = model<IOrdersSchema, IOrdersModel>(
  DB_Module.ORDER,
  OrdersSchema,
  DB_Module.ORDERS,
);
