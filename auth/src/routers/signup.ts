import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserSignUp } from '@src/interfaces';
import { MongoService } from '@src/database';
import { ErrorEx } from '@src/helper';

const opt: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '1d',
};

export const SignUp = async (req: Request<unknown, unknown, UserSignUp>, res: Response, next: NextFunction) => {
  try {
    const salt = process.env.JWT_SALT;
    if (!salt) throw new ErrorEx('Forbidden', null, 403);

    const DB = new MongoService().user;

    const { email, password } = req.body;
    const exist = await DB.findOne({ email }).exec();
    if (exist) throw new ErrorEx('User exist', null, 400);

    const user = await DB.addition({ email, password });

    const accessToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
        iat: Math.floor(Date.now() / 1000),
      },
      salt,
      opt,
    );

    req.session = {
      jwt: { accessToken },
    };

    res.status(201).send({
      data: {
        email: user.email,
        id: user._id,
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};
