import { AxiosInstance } from 'axios';
import { NextPageContext } from 'next/types';

export type FnProps<T> = (
  context: NextPageContext,
  client?: AxiosInstance,
  payload?: Record<string, unknown>,
) => T | Promise<T>;
