import { describe, test, expect } from '@jest/globals';
import { query } from '../../test/utils/server';

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
const routerUrl: string = '/api/v1/users/currentuser';
const userSignUp = { email: 'test@test.test', password: 'test' };

describe('[Current User]:', () => {
  test('[201] response with details about the current user:', async () => {
    await query(routerUrluserSignUp, 'post', userSignUp);
    const signin = await query(routerUrlSinIn, 'post', userSignUp);
    validateResponse201(signin, userSignUp.email);
    const cookie = signin.get('Set-Cookie');
    expect(cookie).toBeDefined();

    const res = await query(routerUrl, 'get', {}, '', cookie);
    const { statusCode, body } = res;
    const { data } = body;
    expect(statusCode).toBe(201);
    expect(data.email).toEqual(userSignUp.email);
    expect(data.id).toBeDefined();
  });

  test('[401] failed response when user unauthorized:', async () => {
    const res = await query(routerUrl, 'get', {});
    const { statusCode, body } = res;
    const { error } = body;

    const cookie = res.get('Set-Cookie');
    expect(cookie).not.toBeDefined();

    expect(statusCode).toBe(401);
    expect(error.message).toEqual('Unauthorized');
  });
});
