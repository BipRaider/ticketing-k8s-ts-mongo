import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';

import { API } from '@src/helpers/api';
import { IncomingMessage } from 'http';

export class ClientAxios {
  req: IncomingMessage;

  constructor({ req }: NextPageContext) {
    if (req) this.req = req;
  }

  init = (): AxiosInstance => {
    if (this.req !== undefined) {
      return axios.create({
        baseURL: API.urlList.url_k8s,
        headers: this.req.headers,
        timeout: 1000,
      });
    }
    return axios.create({
      baseURL: '/',
      timeout: 1000,
    });
  };
}
