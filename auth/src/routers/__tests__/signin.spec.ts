import { describe, test, expect } from '@jest/globals';

import { query } from '../../test/utils/server';

const validateResponse400 = (res: any, status: number = 400) => {
  const { statusCode, body } = res;
  const { error, data } = body;

  expect(statusCode).toBe(status);
  expect(data).not.toBeDefined();
  expect(error.message).toBeDefined();
};

const validateResponse201 = (res: any, email: string) => {
  const { statusCode, body } = res;
  const { data } = body;
  expect(statusCode).toBe(201);
  expect(data.email).toBe(email);
  expect(data.id).toBeDefined();
  expect(data.password).not.toBeDefined();
};
const routerUrluserSignUp: string = '/api/v1/users/signup';
const routerUrl: string = '/api/v1/users/signin';
const userSignUp = { email: 'test@test.test', password: 'test' };

describe('[SignIn]:', () => {
  describe('Status [201]', () => {
    test('successful sing in:', async () => {
      await query(routerUrluserSignUp, 'post', userSignUp);
      const res = await query(routerUrl, 'post', userSignUp);
      validateResponse201(res, 'test@test.test');
    });
    test('sets a cookie after successful sing in:', async () => {
      await query(routerUrluserSignUp, 'post', userSignUp);
      const res = await query(routerUrl, 'post', userSignUp);

      validateResponse201(res, 'test@test.test');
      const cookie = res.get('Set-Cookie');
      expect(cookie).toBeDefined();
    });
  });

  test('[401]failed sign in when password is invalid:', async () => {
    await query(routerUrluserSignUp, 'post', userSignUp);
    const res = await query(routerUrl, 'post', { email: 'test@test.test', password: 'passInvalid' });
    validateResponse400(res, 401);
  });

  describe('Status [400]', () => {
    test('failed sign in when user is not exist:', async () => {
      const res = await query(routerUrl, 'post', userSignUp);
      validateResponse400(res);
    });
    describe('Missing data:', () => {
      test('an email and password:', async () => {
        const res = await query(routerUrl, 'post', { email: '', password: 'test' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);
        expect(error.message).toBe('Invalid credentials');
      });
      test('an email:', async () => {
        const res = await query(routerUrl, 'post', { email: '', password: 'test' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);
        expect(error.message).toBe('Invalid credentials');
      });
      test('a password:', async () => {
        const res = await query(routerUrl, 'post', { email: 'test@test.test', password: '' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);

        expect(error.message).toBe('Invalid credentials');
      });
    });
    describe('Invalid data:', () => {
      test('a email:', async () => {
        const res = await query(routerUrl, 'post', { email: 'test@', password: 'test' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);
        expect(error.message).toBe('Invalid credentials');
      });
      test('a length less password:', async () => {
        const res = await query(routerUrl, 'post', { email: 'test@test.test', password: '123' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);

        expect(error.message).toBe('Invalid credentials');
      });
      test('a longer length password:', async () => {
        const res = await query(routerUrl, 'post', {
          email: 'test@test.test',
          password: '123123123123123123asdasdasdasdas',
        });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);

        expect(error.message).toBe('Invalid credentials');
      });
    });
  });
});
