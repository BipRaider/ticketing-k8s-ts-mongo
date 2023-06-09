import { NextFunction, Request, Response } from 'express';
import { ErrorEx, JwtService, PasswordService } from '@bipdev/common';

import { UserSignIn } from '@src/interfaces';
import { MongoService } from '@src/database';

export const SignIn = async (req: Request<unknown, unknown, UserSignIn>, res: Response, next: NextFunction) => {
  try {
    const DB = new MongoService().user;
    const JWT = new JwtService();
    const { email, password } = req.body;

    const user = await DB.findOne({ email }).exec();

    if (!user) throw new ErrorEx('User is not exist', null, 400);
    const passCheck = await PasswordService.compare(user.password, password);
    if (!passCheck) throw new ErrorEx('Invalid credentials', null, 401);

    const accessToken = await JWT.accessToken({ email: user.email, id: user.id });
    JWT.addToSession(req);

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
