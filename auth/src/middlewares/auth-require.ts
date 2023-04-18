import { NextFunction, Request, Response } from 'express';

import { ErrorEx } from '@src/helper';

export const authRequire = (req: Request, _res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) throw new ErrorEx('Unauthorized', [], 401);

  next();
};
