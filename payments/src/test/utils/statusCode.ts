import { expect } from '@jest/globals';

/** response error, default `400` */
export const ResErr = (res: any, status: 400 | 401 | 404 | 403, msg?: string) => {
  const { statusCode, body } = res;
  const { error, data } = body;

  expect(data).not.toBeDefined();
  expect(error.message).toBeDefined();
  expect(statusCode).toBe(status);
  if (msg) expect(error.message).toEqual(msg);
};

export const ResErr404 = (res: any, msg?: string) => {
  const { statusCode, body } = res;
  const { error, data } = body;
  const message = msg || 'Requested page not found.';

  expect(data).not.toBeDefined();
  expect(error.data).toBeNull();
  expect(error.message).toBe(message);
  expect(statusCode).toBe(404);
};

export const StatusIsNot = (res: any, status: number) => {
  const { statusCode } = res;
  expect(statusCode).not.toEqual(status);
};

export const ResOK = (res: any, status: 200 | 201 | 301 | 204 | 203, st?: number | string) => {
  const { statusCode, body } = res;
  const { data, error } = body;

  expect(error).not.toBeDefined();
  expect(data).toBeDefined();
  expect(statusCode).toBe(status);

  if (st) expect(data.status).toEqual(st);
};
