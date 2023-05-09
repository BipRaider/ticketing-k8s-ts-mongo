export enum DB_Module {
  ORDER = 'order',
  ORDERS = 'orders',
  TICKET = 'ticket',
  TICKETS = 'tickets',
}

/**
 ** Sort descending `-1`, `desc`, `descending`
 ** Sort ascending `1 `, `asc`, `ascending`
 */
export enum ESortDB {
  asc = 'asc',
  desc = 'desc',
  ascending = 'ascending',
  descending = 'descending',
  once = 1,
  minusOnce = -1,
}
