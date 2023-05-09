import { Request, Response } from 'express';

import { MongoService } from '@src/database';

export const getAll = async (_req: Request<{ id: string }>, res: Response): Promise<void> => {
  const DB = new MongoService().orders;

  const items = await DB.find().exec();

  res.status(200).send({
    data: items.map(item => {
      return {
        status: item.status,
        expiresAt: item.expiresAt,
        userId: item.userId,
        ticket: item.ticket,
        id: item.id,
      };
    }),
  });
};
