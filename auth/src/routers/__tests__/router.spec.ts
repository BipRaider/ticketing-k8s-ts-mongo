import { describe, test, expect } from '@jest/globals';

import { query } from '../../test/utils/server';

const routerUrl: string = '/api/v1/users/12412412sdPageNotFoundajflkasdf';

describe('[Router]:', () => {
  test('[404] Page not found:', async () => {
    const res = await query(routerUrl, 'get', {});
    const { statusCode, body } = res;
    const { error, data } = body;

    expect(statusCode).toBe(404);
    expect(data).not.toBeDefined();
    expect(error.data).toBeNull();
    expect(error.message).toBe('Requested page not found.');
  });
});
