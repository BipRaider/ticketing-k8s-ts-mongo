import axios from 'axios';
import { useState } from 'react';

interface AxiosErrorResponse<Err> {
  error?: Err;
}

interface useRequestProps {
  /*** The URL to request the service. */
  url: string;
  /*** Default methods for requests.*/
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

type useRequestReturn<Data, Err> = {
  /*** Make a request to the service. */
  doRequest: (body: Record<string, unknown>) => Promise<void>;
  /*** The response data from the service. */
  payload: Data | null;
  /*** Response from the service.*/
  isSuccess: boolean;
  /*** Error message. */
  error: string;
  /*** List of errors from service. */
  errorData: Err | null;
};

export const useRequest = <
  Response extends Record<keyof Response, Response[keyof Response]>,
  ErrResponse extends Record<keyof ErrResponse, ErrResponse[keyof ErrResponse]>,
>({
  url,
  method,
}: useRequestProps): useRequestReturn<Response, ErrResponse> => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [payload, setData] = useState<Response | null>(null);
  const [error, setError] = useState<string>('');
  const [errorData, setErrorData] = useState<ErrResponse | null>(null);

  const doRequest = async (body: Record<string, unknown>): Promise<void> => {
    try {
      const { data } = await axios[method]<Response>(url, { ...body });

      if (data) {
        setError('');
        setErrorData(null);
        setIsSuccess(true);
        setData(data);
      } else setError('Something went wrong');
    } catch (e) {
      if (axios.isAxiosError<AxiosErrorResponse<{ message: string; data: ErrResponse }>>(e)) {
        if (e.response?.data?.error) {
          const { error } = e.response.data;
          setError(error?.message);
          if (error?.data) setErrorData(error.data);
        }
      }
      if (e instanceof Error) setError(e.message);
    }
  };

  return { doRequest, payload, isSuccess, error, errorData };
};
