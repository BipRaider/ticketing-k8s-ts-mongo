import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';

import { API } from '@src/helpers/api';

export const buildClient = ({ req }: NextPageContext): AxiosInstance => {
  if (typeof window !== undefined) return axios.create({ baseURL: API.urlList.url_k8s, headers: req?.headers });
  return axios.create({ baseURL: '/' });
};
