import { useEffect, FocusEventHandler } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { API } from '@src/helpers/api';
import { Input, Button, Htag } from '@src/components';
import { ApiErrorData } from '@src/interfaces';
import { useAppOptions } from '@src/context/app.context';
import { useRequest } from '@src/hooks';

import styles from './TicketCreateForm.module.scss';
import { TicketCreateProps } from './TicketCreateForm.props';
import { ITicketCreateForm, ITicketCreateSentResponse } from './TicketCreateForm.interface';

export const TicketCreateForm = ({ className, ...props }: TicketCreateProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setError,
    setValue,
  } = useForm<ITicketCreateForm>();

  const { userName } = useAppOptions();
  const router = useRouter();

  const { doRequest, payload, isSuccess, error, errorData } = useRequest<ITicketCreateSentResponse, ApiErrorData[]>({
    method: 'post',
    url: API.tickets.create,
  });

  const onSubmit = async (formData: ITicketCreateForm): Promise<void> => {
    await doRequest({ ...formData });
  };

  useEffect(() => {
    if (payload) void router.push('/');
    if (isSuccess) reset();
  }, [payload]);

  useEffect(() => {
    if (!userName) void router.push('/');
  }, [userName]);

  const PriceOnBlur: FocusEventHandler<HTMLInputElement> = e => {
    const value = parseFloat(e.target?.value);
    if (isNaN(value)) {
      setError('price', { message: 'The price is not correct' });
      setValue('price', '');
    } else {
      setValue('price', value.toFixed(2));
      clearErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.bodyForm, className)} {...props}>
        <Input
          {...register('title', {
            required: {
              value: true,
              message: 'The title is not correct',
            },
          })}
          placeholder="title"
          error={errors.title}
          aria-invalid={errors.title ? true : false}
        />

        <Input
          {...register('price', {
            required: {
              value: true,
              message: 'The price is not correct',
            },
            max: 1000,
            min: 0,
            onBlur: PriceOnBlur,
          })}
          placeholder="price"
          error={errors.price}
          onBlur={PriceOnBlur}
          aria-invalid={errors.price ? true : false}
        />

        <div className={styles.submit}>
          <Button appearance="primary" onClick={() => clearErrors()}>
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
