import mongoose, { Schema, model } from 'mongoose';
import { OrdersStatus } from '@bipdev/contracts';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { DB_Module } from '@src/database';
import { IOrdersAttr, IOrdersModel, IOrdersSchema, TOrdersInstance } from '@src/interfaces';

mongoose.plugin(updateIfCurrentPlugin);

const OrdersSchema = new Schema<IOrdersSchema, IOrdersModel>(
  {
    status: {
      type: String,
      enum: Object.values(OrdersStatus),
      required: true,
      default: OrdersStatus.Created,
    },
    userId: { type: String, required: true },
    expiresAt: { type: Schema.Types.Date },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: DB_Module.TICKET,
    },
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

OrdersSchema.statics.addition = async (date: IOrdersAttr): Promise<TOrdersInstance> => {
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
