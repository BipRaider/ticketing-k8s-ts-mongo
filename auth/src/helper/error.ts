// import { ValidationError } from 'express-validator';
import { Response } from 'express';

export type StatusCodes = 404 | 401 | 500 | 400 | 403;

export class ErrorEx extends Error {
  constructor(message: string, public payload: unknown[] = null, public statusCode: StatusCodes = 404) {
    super(message);

    if (statusCode) this.statusCode = statusCode;

    Object.setPrototypeOf(this, ErrorEx.prototype);
  }
  /** Serialize error method.*/
  public send = (res: Response) => {
    return res.status(this.statusCode).send({
      message: this.message,
      data: this.payload,
    });
  };
}

export class DataBaseConnectionError extends ErrorEx {
  constructor(override payload: unknown[] = null) {
    super('Error connection to database.', payload, 500);
  }
}
