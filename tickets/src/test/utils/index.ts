export * from './statusCode';
export * from './server';

export const url = (router?: string): string => {
  if (router) return `/api/v1/tickets${router}`;
  return '/api/v1/tickets';
};

export const routerUrl = {
  create: url(),
  update: url(),
  getAll: url(),
  getById: (id: string): string => `${url()}/${id}`,
};
