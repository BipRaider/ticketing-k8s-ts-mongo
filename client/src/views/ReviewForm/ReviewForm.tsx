import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { API } from '@src/helpers/api';
import { Input, Button } from '@src/components';

import styles from './ReviewForm.module.scss';
import { ReviewFormProps } from './ReviewForm.props';
import { IReviewForm, IReviewSentResponse } from './ReviewForm.interface';

export const ReviewForm = ({ productId, isOpened, className, ...props }: ReviewFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<IReviewForm>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async (formData: IReviewForm): Promise<void> => {
    try {
      const { data } = await axios.post<IReviewSentResponse>(API.auth.signup, { ...formData, productId });
      if (data.message) {
        setIsSuccess(true);
        reset();
      } else {
        setError('Something went wrong');
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.reviewForm, className)} {...props}>
        <div>
          {isSuccess}:{error}
        </div>
        <Input
          {...register('email', {
            required: {
              value: true,
              message: 'your email',
            },
          })}
          placeholder="email"
          error={errors.email}
          tabIndex={isOpened ? 0 : -1}
          aria-invalid={errors.email ? true : false}
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
          tabIndex={isOpened ? 0 : -1}
          aria-invalid={errors.password ? true : false}
        />

        <div className={styles.submit}>
          <Button appearance="primary" tabIndex={isOpened ? 0 : -1} onClick={() => clearErrors()}>
            submit
          </Button>
        </div>
      </div>
    </form>
  );
};
