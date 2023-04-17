export const API = {
  auth: {
    signin: '/api/v1/users/signin',
    signup: '/api/v1/users/signup',
    signout: '/api/v1/users/signout',
    currentuser: '/api/v1/users/currentuser',
  },
  urlList: {
    /*** `http://SERVER_NAME.NAMESPACE.svc.cluster.local` */
    url_k8s: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    url_domain: process.env.NEXT_PUBLIC_DOMAIN || '',
  },
};
