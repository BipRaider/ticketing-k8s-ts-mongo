import { NextFunction, Request, Response } from 'express';

import { UserSignIn } from '@src/interfaces';

import { Password, JwtService, ErrorEx } from '@src/helper';
import { MongoService } from '@src/database';

export const SignIn = async (req: Request<unknown, unknown, UserSignIn>, res: Response, next: NextFunction) => {
  try {
    const DB = new MongoService().user;
    const JWT = new JwtService();
    const { email, password } = req.body;

    const user = await DB.findOne({ email }).exec();

    if (!user) throw new ErrorEx('User exist', null, 400);
    if (!Password.compare(user.password, password)) throw new ErrorEx('User is invalided', null, 401);

    const accessToken = await JWT.accessToken(
      {
        email: user.email,
        id: user.id,
      },
      req,
    );

    res.status(201).send({
      data: {
        email: user.email,
        id: user.id,
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};
