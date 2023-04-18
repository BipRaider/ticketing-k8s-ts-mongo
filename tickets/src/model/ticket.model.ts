import { Schema, model } from 'mongoose';
import { PasswordService } from '@bipdev/common';

import { DB_Module } from '@src/database';
import { ITicketsAttr, ITicketsModel, ITicketsSchema, TTicketsInstance } from '@src/interfaces';

const TicketsSchema = new Schema<ITicketsSchema, ITicketsModel>(
  {
    email: { type: String, required: true, unique: true, immutable: true },
    password: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  },
);

TicketsSchema.statics['addition'] = async function (date: ITicketsAttr): Promise<TTicketsInstance> {
  const item: TTicketsInstance = new TicketsModel({ password: date.password, email: date.email });

  return item.save();
};

TicketsSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordService.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

export const TicketsModel: ITicketsModel = model<TTicketsInstance, ITicketsModel>(
  DB_Module.TICKET,
  TicketsSchema,
  DB_Module.TICKETS,
);
