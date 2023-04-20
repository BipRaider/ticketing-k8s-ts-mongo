import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { TicketsUpdate } from '@src/interfaces';
import { MongoService } from '@src/database';

export const Update = async (req: Request<unknown, unknown, TicketsUpdate>, res: Response, next: NextFunction) => {
  try {
    const DB = new MongoService().tickets;
    const { id, title, price } = req.body;

    const item = await DB.findByIdAndUpdate(id, { set: { title, price } }).exec();
    if (!item) throw new ErrorEx('item is not exist', null, 400);

    res.status(201).send({
      data: {
        title: item.title,
        price: item.price,
        id: item.id,
      },
    });
  } catch (e) {
    next(e);
  }
};
