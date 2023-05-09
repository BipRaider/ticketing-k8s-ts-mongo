import { Request, Response, NextFunction } from 'express';
import { ErrorEx } from '@bipdev/common';

import { MongoService } from '@src/database';

export const getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { params } = req;
    const DB = new MongoService().orders;

    const item = await DB.findById(params.id).exec();
    if (!item) throw new ErrorEx('Ticket is not exist', null, 404);

    res.status(200).send({
      data: {
        status: item.status,
        expiresAt: item.expiresAt,
        userId: item.userId,
        ticket: item.ticket,
        id: item.id,
      },
    });
  } catch (e) {
    next(e);
  }
};
