import { Schema, model } from 'mongoose';

import { DB_Module } from '@src/database';
import { Payment, IPaymentsModel, IPaymentsSchema, IPaymentsDoc } from '@src/interfaces';

const PaymentsSchema = new Schema<IPaymentsDoc, IPaymentsModel>(
  {
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toJSON: {
      transform: (_doc, ret: IPaymentsSchema): void => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

PaymentsSchema.statics.addition = async (date: Payment): Promise<IPaymentsSchema> => {
  const item: IPaymentsSchema = new PaymentsModel({
    orderId: date.orderId,
    stripeId: date.stripeId,
  });
  return await item.save();
};

export const PaymentsModel: IPaymentsModel = model<IPaymentsSchema, IPaymentsModel>(
  DB_Module.PAYMENT,
  PaymentsSchema,
  DB_Module.PAYMENTS,
);
