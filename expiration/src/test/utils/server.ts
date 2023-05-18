import request from 'supertest';
import { app } from '../../app';
import { JwtService } from '@bipdev/common';

export const query = async (
  url: string,
  methods: 'get' | 'post' | 'put' | 'delete' | 'patch',
  data: string | object,
  token = '',
  cookie: string[] = null,
) => {
  if (cookie) {
    return await request(app)
      [methods](url)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookie)
      .send(data);
  }

  return await request(app)
    [methods](url)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(data);
};

export const createCookie = async (data?: any): Promise<{ cookie: string[]; accessToken: string }> => {
  const JWT = new JwtService();
  //jwt payload
  const user = data || { id: '64413d6d2ef980df596c0ddb', email: 'test@test.test' };
  //create access token
  const accessToken = await JWT.accessToken(user);
  //build session object
  const session = { jwt: { accessToken } };
  // turn that session into json
  const sessionJSON = JSON.stringify(session);
  //take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return { cookie: [`session=${base64}`], accessToken };
};
