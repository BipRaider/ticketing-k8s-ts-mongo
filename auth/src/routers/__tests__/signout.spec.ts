import { describe, test, expect } from '@jest/globals';

import { query } from '../../test/server';

const validateResponse201 = (res: any, email: string) => {
  const { statusCode, body } = res;
  const { data } = body;
  expect(statusCode).toBe(201);
  expect(data.email).toBe(email);
  expect(data.id).toBeDefined();
  expect(data.password).not.toBeDefined();
};

const routerUrluserSignUp: string = '/api/v1/users/signup';
const routerUrlSinIn: string = '/api/v1/users/signin';
const routerUrl: string = '/api/v1/users/signout';
const userSignUp = { email: 'test@test.test', password: 'test' };

describe('[SignOut]:', () => {
  test('[201] clears cookie after sign out :', async () => {
    await query(routerUrluserSignUp, 'post', userSignUp);
    const res = await query(routerUrlSinIn, 'post', userSignUp);

    validateResponse201(res, 'test@test.test');
    const cookie = res.get('Set-Cookie');
    expect(cookie).toBeDefined();

    const res2 = await query(routerUrl, 'post', {});
    const cookie2 = res2.get('Set-Cookie');
    expect(cookie2).not.toEqual(cookie);
  });
});
