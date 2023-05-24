export const API = {
  auth: {
    /** `/api/v1/users/signin` */
    signin: '/api/v1/users/signin',
    /** `/api/v1/users/signup` */
    signup: '/api/v1/users/signup',
    /** `/api/v1/users/signout` */
    signout: '/api/v1/users/signout',
    /** `/api/v1/users/currentuser` */
    currentuser: '/api/v1/users/currentuser',
  },
  urlList: {
    /*** `http://SERVER_NAME.NAMESPACE.svc.cluster.local` */
    url_k8s: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    url_domain: process.env.NEXT_PUBLIC_DOMAIN || '',
  },
  tickets: {
    /*** `POST` Ticket create `/api/v1/tickets` */
    create: '/api/v1/tickets',
    /*** `GET` List of tickets */
    getTickets: '/api/v1/tickets',
    /*** `GET` Ticket by id */
    getTicket: (id: string): string => `/api/v1/tickets/${id}`,
    /*** `PUT` Update ticket by id */
    update: (id: string): string => `/api/v1/tickets/${id}`,
  },
  orders: {
    /*** `POST` Order create `/api/v1/orders` */
    create: '/api/v1/orders',
    /*** `GET` List of orders */
    getOrders: '/api/v1/orders',
    /*** `GET` Order by id */
    getOrder: (id: string): string => `/api/v1/orders/${id}`,
    /*** `DELETE` order by id */
    delete: (id: string): string => `/api/v1/orders/${id}`,
  },
  payments: {
    /** `POST` Payment create  `/api/v1/payments` */
    create: '/api/v1/payments',
    /*** `GET` Payment by id */
    getPayment: (id: string): string => `/api/v1/payments/${id}`,
  },
};
