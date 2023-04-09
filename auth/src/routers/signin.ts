import { Request, Response } from 'express';

import { UserSignIn } from '../interfaces';

export const SignIn = (req: Request<unknown, unknown, UserSignIn>, res: Response) => {
  const { email, password } = req.body;

  console.log('Body SignIn:', { email, password });

  res.status(201).send({
    text: 'SignIn',
  });
};
