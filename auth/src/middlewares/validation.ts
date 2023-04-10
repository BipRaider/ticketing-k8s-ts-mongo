import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ErrorEx } from '../helper';

/*** Middleware that handles requests from clients.
 * @throw Error `400` if the request is invalid and return a list of errors to the client.
 * @next Skipping to next func if the request is valid.
 */
export const validation = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ErrorEx('Invalid credentials', errors.array(), 400);

  next();
};
