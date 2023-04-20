import { Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { MongoService } from '@src/database';

export const getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { params } = req;
  const DB = new MongoService().tickets;

  const item = await DB.findById(params.id).exec();
  if (!item) throw new ErrorEx('Ticket is not exist', null, 404);

  res.status(201).send({
    id: item.id,
    title: item.title,
    userId: item.userId,
    price: item.price,
  });
};
