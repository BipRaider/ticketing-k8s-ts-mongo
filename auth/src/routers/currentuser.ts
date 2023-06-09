import { Request, Response } from 'express';

import { MongoService } from '@src/database';

export const CurrentUser = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    res.status(201).send({ data: {} });
    return;
  }

  const DB = new MongoService().user;

  const user = await DB.findById(req.user.id).select({ password: 0 }).exec();

  res.status(201).send({
    data: user,
  });
};
