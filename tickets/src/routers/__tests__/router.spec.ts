import { describe, test } from '@jest/globals';

import { query, ResErr404, StatusIsNot, url, createCookie } from '../../test/utils';

describe('[Router]:', () => {
  test('[404]: Page not found:', async () => {
    const res = await query(url('12412412sdPageNotFoundajflkasdf'), 'get', {});
    ResErr404(res);
  });
  test(`[GET]: Page ${url()} found.`, async () => {
    const res = await query(url(), 'get', {});
    StatusIsNot(res, 404);
  });

  test(`[GET]: Page ${url('/some_id')} found.`, async () => {
    const res = await query(url('/some_id'), 'get', {});
    StatusIsNot(res, 404);
  });
  test(`[POST]: Page ${url()} found.`, async () => {
    const res = await query(url(), 'post', {});
    StatusIsNot(res, 404);
  });
  test(`[PUT]: Page ${url()} found.`, async () => {
    const res = await query(url(), 'put', {});
    StatusIsNot(res, 404);
  });
});
