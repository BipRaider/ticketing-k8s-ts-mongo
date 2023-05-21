import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { isObjectIdOrHexString } from 'mongoose';
import { ErrorEx } from '@bipdev/common';

/*** Middleware that handles requests from clients.
 * @throw Error `400` if the request is invalid and return a list of errors to the client.
 * @next Skipping to next func if the request is valid.
 */
export const validation = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ErrorEx('Invalid credentials', errors.array(), 400);
  }

  if (req.params?.id && !isObjectIdOrHexString(req.params.id)) {
    throw new ErrorEx(
      'Invalid credentials',
      [{ param: 'id', msg: 'Is not ObjectId', location: 'params', value: req.params?.id }],
      400,
    );
  }

  if (req?.user?.id && !isObjectIdOrHexString(req.user.id)) {
    throw new ErrorEx(
      'Invalid credentials',
      [{ param: 'userId', msg: 'Is not ObjectId', location: 'body', value: req.body.userId }],
      400,
    );
  }

  if (req?.body?.ticketId && !isObjectIdOrHexString(req.body.ticketId)) {
    throw new ErrorEx(
      'Invalid credentials',
      [{ param: 'ticketId', msg: 'Is not ObjectId', location: 'body', value: req?.body?.ticketId }],
      400,
    );
  }

  next();
};
