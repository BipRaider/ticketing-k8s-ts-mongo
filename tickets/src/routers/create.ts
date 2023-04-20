import { NextFunction, Request, Response } from 'express';
import { ErrorEx } from '@bipdev/common';

import { TicketsCreate } from '@src/interfaces';
import { MongoService } from '@src/database';

export const Create = async (
  req: Request<unknown, unknown, TicketsCreate>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const DB = new MongoService().tickets;
    const { title, price } = req.body;
    const userId = req.user.id;
    const exist = await DB.findOne({ title }).exec();
    if (exist) throw new ErrorEx('Ticket exist', null, 400);
    const item = await DB.addition({ title, price, userId });

    res.status(201).send({
      data: {
        title: item.title,
        price: item.price,
        userId: item.userId,
        id: item.id,
      },
    });
    return;
  } catch (e) {
    next(e);
  }
};
