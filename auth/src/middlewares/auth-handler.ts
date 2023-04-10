import { NextFunction, Request, Response } from 'express';

import { JwtService } from '@src/helper';

export const authHandler = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const sessionJwt = req.session?.jwt;

  let token: string;
  if (authorization && typeof authorization === 'string') token = authorization.split(' ')[1];
  if (sessionJwt && sessionJwt.accessToken) token = sessionJwt.accessToken;

  if (token) {
    const JWT = new JwtService();
    const payload = await JWT.valid(token);
    if (typeof payload !== 'string') req.user = { id: payload.id, email: payload.email };
  }

  next();
};
