import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { TicketsUpdate } from '@src/interfaces';
import { MongoService } from '@src/database';

export const Update = async (
  req: Request<{ id: string }, unknown, TicketsUpdate>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const DB = new MongoService().tickets;
    const { id } = req.params;
    const { title, price } = req.body;

    const item = await DB.findByIdAndUpdate(id, { $set: { title, price } }, { new: true }).exec();
    if (!item) throw new ErrorEx('Ticket is not exist', null, 404);

    res.status(200).send({
      data: {
        title: item.title,
        price: item.price,
        userId: item.userId,
        id: item.id,
      },
    });
  } catch (e) {
    next(e);
  }
};
