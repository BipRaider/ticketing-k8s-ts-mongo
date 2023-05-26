import { describe, test } from '@jest/globals';
import { query, ResErr, routerUrl, createCookie, createMongoId } from '../../test/utils';

describe('[GET BY ID]:', () => {
  test.todo('Need an implementation works of the getById func');

  describe('[ERROR]:', () => {
    test('[401] The user is unauthorized:', async () => {
      const res = await query(routerUrl.getById('s'), 'get', {});
      ResErr(res, 401);
    });
    test('[400] The order id is invalid:', async () => {
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById('qwertyuiopas'), 'get', {}, '', cookie);
      ResErr(res, 400, 'Invalid credentials');
    });
    test('[404] the order is not exist', async () => {
      const id = createMongoId();
      const { cookie } = await createCookie();
      const res = await query(routerUrl.getById(id), 'get', {}, '', cookie);
      ResErr(res, 404, 'The Order is not exist');
    });
  });
});
