import { Request } from 'express';
import jwt from 'jsonwebtoken';

export class JwtService {
  readonly #salt: string;
  readonly #accessOpt: jwt.SignOptions;

  constructor() {
    this.#salt = process.env['JWT_SALT'];
    this.#accessOpt = {
      algorithm: 'HS256',
      expiresIn: process.env['JWT_ACCESS_EXP'] || '1d',
    };
  }

  public accessToken = async (payload: any, req: Request<unknown>): Promise<string> => {
    const accessToken = jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
      },
      this.#salt,
      this.#accessOpt,
    );

    req.session = {
      jwt: { accessToken },
    };

    return accessToken;
  };
}
