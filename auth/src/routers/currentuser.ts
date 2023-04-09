import { Request, Response } from 'express';

export const CurrentUser = (req: Request, res: Response) => {
  const { body } = req;

  console.log('Body CurrentUser:', body);

  res.status(201).send({
    text: 'CurrentUser',
  });
};
