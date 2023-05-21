import { Request, Response, NextFunction } from 'express';
import { ErrorEx } from '@bipdev/common';

import { MongoService } from '@src/database';

export const getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { params } = req;
    const DB = new MongoService().orders;

    const item = await DB.findById(params.id).exec();

    if (!item) throw new ErrorEx('The Order is not exist', null, 404);
    if (item.userId !== req?.user?.id) throw new ErrorEx('Unauthorized', null, 401);

    res.status(200).send({
      data: {
        id: item.id,
        status: item.status,
        price: item.price,
        userId: item.userId,
        version: item.version,
      },
    });
  } catch (e) {
    next(e);
  }
};
