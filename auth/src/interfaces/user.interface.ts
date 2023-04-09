import { Document, Model, ObjectId } from 'mongoose';

export interface IUserAttr {
  email: string;
  password: string;
}

export interface User extends IUserAttr {
  id: string;
}

export interface IUserSchema extends Document<ObjectId | string>, IUserAttr {
  readonly createAt?: Date;
  readonly updateAt?: Date;
}

export type UserSignUp = Omit<User, 'id'>;
export type UserSignIn = Omit<User, 'id'>;
export type TUser = Pick<IUserSchema, 'email' | 'password' | '_id'>;
export type TUserInstance = IUserSchema;

export interface IUserModel extends Model<TUserInstance> {
  addition: (date: IUserAttr) => Promise<TUserInstance>;
}
