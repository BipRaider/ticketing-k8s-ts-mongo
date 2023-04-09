import { Schema, model } from 'mongoose';

import { DB_Module } from '@src/database';
import { IUserAttr, IUserModel, IUserSchema, TUserInstance } from '@src/interfaces';
import { Password } from '@src/helper';

const UserSchema = new Schema<IUserSchema, IUserModel>(
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

UserSchema.statics['addition'] = async function (date: IUserAttr): Promise<TUserInstance> {
  const user: TUserInstance = new UserModel({ password: date.password, email: date.email });

  return user.save();
};

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

export const UserModel: IUserModel = model<TUserInstance, IUserModel>(DB_Module.USER, UserSchema, DB_Module.USERS);
