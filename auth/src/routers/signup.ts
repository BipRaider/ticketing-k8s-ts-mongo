import { NextFunction, Request, Response } from 'express';
import { ErrorEx, JwtService } from '@bipdev/common';

import { UserSignUp } from '@src/interfaces';
import { MongoService } from '@src/database';

export const SignUp = async (
  req: Request<unknown, unknown, UserSignUp>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const DB = new MongoService().user;
    const JWT = new JwtService();
    const { email, password } = req.body;

    const exist = await DB.findOne({ email }).exec();
    if (exist) throw new ErrorEx('User exist', null, 400);

    const user = await DB.addition({ email, password });

    const accessToken = await JWT.accessToken({ email: user.email, id: user.id });
    JWT.addToSession(req);

    res.status(201).send({
      data: {
        email: user.email,
        id: user.id,
        accessToken,
      },
    });
    return;
  } catch (e) {
    next(e);
  }
};
