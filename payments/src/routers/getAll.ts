import { Request, Response } from 'express';

import { DB_Module, MongoService } from '@src/database';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const DB = new MongoService().orders;
  const userId = req.user.id;
  const items = await DB.find({
    userId,
  })
    .populate(DB_Module.TICKET)
    .exec();

  res.status(200).send({
    data: items.map(item => {
      return {
        status: item.status,
        expiresAt: item.expiresAt,
        userId: item.userId,
        ticket: item.ticket,
        version: item.version,
        id: item.id,
      };
    }),
  });
};
