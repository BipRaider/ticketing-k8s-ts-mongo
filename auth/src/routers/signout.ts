import { Request, Response } from 'express';

export const SignOut = (req: Request, res: Response) => {
  req.session = null;
  res.status(201).end();
};
