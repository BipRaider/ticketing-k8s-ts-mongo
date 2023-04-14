export interface AxiosErrorResponse {
  error?: ApiErrorResponse;
}

export interface ApiErrorResponse {
  message: string;
  data: ApiErrorData[] | null;
}

export interface ApiErrorData {
  location: string;
  msg: string;
  param: string;
  value: string;
}
