import { Request, Response } from 'express';

export const SignOut = (req: Request, res: Response) => {
  const { body } = req;

  console.log('Body SignOut:', body);

  res.status(201).send({
    text: 'SignOut',
  });
};
