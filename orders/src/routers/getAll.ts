import { Request, Response } from 'express';

import { MongoService } from '@src/database';

export const getAll = async (_req: Request<{ id: string }>, res: Response): Promise<void> => {
  const DB = new MongoService().tickets;

  const items = await DB.find().exec();

  res.status(200).send({
    data: items.map(item => {
      return {
        id: item.id,
        title: item.title,
        userId: item.userId,
        price: item.price,
      };
    }),
  });
};
