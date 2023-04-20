export * from './statusCode';
export * from './server';

export const url = (router?: string): string => {
  if (router) return `/api/v1/tickets${router}`;
  return '/api/v1/tickets';
};

export const routerUrl = {
  create: url(),
  update: (id: string): string => `${url()}/${id}`,
  getAll: url(),
  getById: (id: string): string => `${url()}/${id}`,
};

export const idTest = '64413d6d2ef980df596c0ddb';
export const idTestUser = '64413d6d2af980df596c0ddb';
