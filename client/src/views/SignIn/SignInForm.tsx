import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { useUserOptions } from '@src/context/user.context';
import { API } from '@src/helpers/api';
import { Input, Button, Htag } from '@src/components';
import { useRequest } from '@src/hooks';
import { ApiErrorData } from '@src/interfaces';

import styles from './SignInForm.module.scss';
import { SignInFormProps } from './SignInForm.props';
import { ISignInForm, ISignInSentResponse } from './SignInForm.interface';

export const SignInForm: React.FC<SignInFormProps> = ({ className, ...props }: SignInFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<ISignInForm>();
  const [data, setData] = useState<ISignInSentResponse['data']>();
  const { setUserName } = useUserOptions();
  const router = useRouter();
  const { doRequest, payload, isSuccess, error, errorData } = useRequest<ISignInSentResponse, ApiErrorData[]>({
    method: 'post',
    url: API.auth.signin,
  });

  const onSubmit = async (formData: ISignInForm): Promise<void> => {
    await doRequest({ ...formData });
  };

  useEffect(() => {
    if (payload) setData(payload.data);
  }, [payload]);

  useEffect(() => {
    if (data?.email && setUserName) setUserName(data.email);
  }, [data]);

  useEffect(() => {
    if (isSuccess) void router.push('/');
    if (isSuccess) reset();
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.bodyForm, className)} {...props}>
        <Input
          {...register('email', {
            required: {
              value: true,
              message: 'your email',
            },
          })}
          placeholder="email"
          className={styles.email}
          error={errors.email}
          tabIndex={0}
        />

        <Input
          {...register('password', {
            required: {
              value: true,
              message: 'your password',
            },
          })}
          placeholder="Password"
          className={styles.password}
          error={errors.password}
          tabIndex={0}
        />

        <div className={styles.submit}>
          <Button appearance="primary" onClick={(): void => clearErrors()}>
            submit
          </Button>
        </div>
        {isSuccess && <span className={styles.success}>Success</span>}
        {error && (
          <div className="alert alert-danger">
            <Htag tag="h3">{error}</Htag>
            <ul className="my-0">
              {!!errorData &&
                errorData.map((err): JSX.Element => {
                  return (
                    <li key={err.param}>
                      <span className={styles.error}>{err.msg}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
};
