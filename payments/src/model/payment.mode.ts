import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { DB_Module } from '@src/database';
import { Payment, IPaymentsModel, IPaymentsSchema, IPaymentsDoc } from '@src/interfaces';

mongoose.plugin(updateIfCurrentPlugin);

const PaymentsSchema = new Schema<IPaymentsDoc, IPaymentsModel>(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
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

PaymentsSchema.set('versionKey', 'version');

PaymentsSchema.statics.addition = async (date: Payment): Promise<IPaymentsSchema> => {
  const item: IPaymentsSchema = new PaymentsModel({
    _id: date.id,
    version: date.version,
    price: date.price,
    userId: date.userId,
  });
  return await item.save();
};

PaymentsSchema.statics.findByVersion = async (data: {
  id: string;
  version: number;
}): Promise<IPaymentsSchema | null> => {
  const version: number = data.version - 1;
  const ticket = await PaymentsModel.findOne({ _id: data.id, version });
  return ticket;
};

export const PaymentsModel: IPaymentsModel = model<IPaymentsSchema, IPaymentsModel>(
  DB_Module.PAYMENT,
  PaymentsSchema,
  DB_Module.PAYMENTS,
);
