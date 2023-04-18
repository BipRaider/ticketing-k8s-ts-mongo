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
};
