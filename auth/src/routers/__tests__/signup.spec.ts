import { describe, test, expect } from '@jest/globals';

import { query } from '../../test/server';

const validateResponse400 = (res: any) => {
  const { statusCode, body } = res;
  const { error, data } = body;

  expect(statusCode).toBe(400);
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

const routerUrl: string = '/api/v1/users/signup';
const userSignUp = { email: 'test@test.test', password: 'test' };

describe('[SignUp]:', () => {
  test('[201] successful signup:', async () => {
    const res = await query(routerUrl, 'post', userSignUp);

    validateResponse201(res, 'test@test.test');
  });
  test('[201]sets a cookie after successful signup:', async () => {
    const res = await query(routerUrl, 'post', userSignUp);
    validateResponse201(res, 'test@test.test');
    const cookie = res.get('Set-Cookie');
    expect(cookie).toBeDefined();
  });
  describe('Status [400]:', () => {
    test('disallows duplicate email:', async () => {
      await query(routerUrl, 'post', userSignUp);
      const res = await query(routerUrl, 'post', userSignUp);
      const { body } = res;
      const { error } = body;
      validateResponse400(res);
      expect(error.message).toBe('User exist');
      expect(error.data).toBeNull();
    });
    describe('Missing data', () => {
      test('missing email and password:', async () => {
        const res = await query(routerUrl, 'post', { email: '', password: 'test' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);
        expect(error.message).toBe('Invalid credentials');
      });
      test('missing email:', async () => {
        const res = await query(routerUrl, 'post', { email: '', password: 'test' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);
        expect(error.message).toBe('Invalid credentials');
      });
      test('missing password:', async () => {
        const res = await query(routerUrl, 'post', { email: 'test@test.test', password: '' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);

        expect(error.message).toBe('Invalid credentials');
      });
    });
    describe('Invalid data', () => {
      test('an invalid email:', async () => {
        const res = await query(routerUrl, 'post', { email: 'test@', password: 'test' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);
        expect(error.message).toBe('Invalid credentials');
      });
      test('an invalid length less password:', async () => {
        const res = await query(routerUrl, 'post', { email: 'test@test.test', password: '123' });
        const { body } = res;
        const { error } = body;
        validateResponse400(res);

        expect(error.message).toBe('Invalid credentials');
      });
      test('an invalid longer length password:', async () => {
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
