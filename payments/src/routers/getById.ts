import { Request, Response, NextFunction } from 'express';
import { ErrorEx } from '@bipdev/common';

import { DB_Module, MongoService } from '@src/database';

export const getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { params } = req;
    const DB = new MongoService().orders;

    const item = await DB.findById(params.id).populate(DB_Module.TICKET).exec();

    if (!item) throw new ErrorEx('The Order is not exist', null, 404);
    if (item.userId !== req?.user?.id) throw new ErrorEx('Unauthorized', null, 401);

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
