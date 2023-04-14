import request from 'supertest';
import { app } from '../../app';

export const query = async (
  url: string,
  methods: 'get' | 'post',
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
