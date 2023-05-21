import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrdersStatus } from '@bipdev/contracts';

import { DB_Module, MongoService } from '@src/database';
import { Tickets, ITicketsModel, ITicketsSchema, TTicketsInstance } from '@src/interfaces';

mongoose.plugin(updateIfCurrentPlugin);

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
    },
  },
);

TicketsSchema.set('versionKey', 'version');

// TicketsSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   };
//   done();
// });

TicketsSchema.statics.addition = async (date: Tickets): Promise<TTicketsInstance> => {
  const item: TTicketsInstance = new TicketsModel({
    title: date.title,
    price: date.price,
    _id: date.id,
  });
  return await item.save();
};

TicketsSchema.statics.findByVersion = async (data: {
  id: string;
  version: number;
}): Promise<TTicketsInstance | null> => {
  const version: number = data.version - 1;
  const ticket = await TicketsModel.findOne({ _id: data.id, version });
  return ticket;
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
