import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { API } from '@src/helpers/api';
import { useAppOptions } from '@src/context/app.context';
import { useRequest } from '@src/hooks';

export const SignOut = (): JSX.Element => {
  const { userName, setUserName } = useAppOptions();
  const router = useRouter();
  const { doRequest, isSuccess, payload } = useRequest({
    method: 'post',
    url: API.auth.signout,
  });

  useEffect((): void => {
    void doRequest({});
    if (setUserName) setUserName('');
    void router.push('/auth/signin');
  }, []);

  useEffect((): void => {
    if (isSuccess && setUserName) setUserName('');
  }, [isSuccess, payload]);

  useEffect((): void => {
    if (!userName) void router.push('/auth/signin');
    if (isSuccess) void router.push('/auth/signin');
  }, [userName, isSuccess]);

  return <div></div>;
};
