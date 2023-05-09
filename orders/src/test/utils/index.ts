export * from './statusCode';
export * from './server';
export * from './mongo';

export const url = (router?: any): string => {
  if (router) return `/api/v1/orders${router}`;
  return '/api/v1/orders';
};

export const routerUrl = {
  create: url(),
  delete: (id: any): string => `${url()}/${id}`,
  getAll: url(),
  getById: (id: any): string => `${url()}/${id}`,
};

export const idTest = '64413d6d2ef980df596c0ddb';
export const idTestUser = '64413d6d2af980df596c0ddb';
