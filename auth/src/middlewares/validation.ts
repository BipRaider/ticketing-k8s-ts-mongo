import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ErrorEx } from '../helper';

export const validation = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ErrorEx('Data is invalidate', errors.array(), 400);
  }

  next();
};
