import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

import { withPageLayout } from '@src/layout/Layout';
import { useRequest } from '@src/hooks';
import { IPageContext } from '@src/context/page.context';
import { ApiErrorData, FirstLevelMenu, Order, StripeCard } from '@src/interfaces';
import { FnProps } from '@src/interfaces/pageProps.interface';
import { API } from '@src/helpers/api';
import { useAppOptions } from '@src/context/app.context';

import { Error404 } from '../404';
import { Htag } from '@src/components';

interface TypeProps extends IPageContext, Record<string, unknown> {
  order?: Order | null;
  stripeKey: string;
}

const OrderShow: React.FC<TypeProps> = ({ order, stripeKey }: TypeProps): JSX.Element => {
  const router = useRouter();
  const { userName } = useAppOptions();
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [pubKey, setPubKey] = useState<string>(stripeKey);

  const { doRequest, isSuccess, error, errorData } = useRequest<Record<string, unknown>, ApiErrorData[]>({
    method: 'post',
    url: API.payments.create,
  });

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (order?.expiresAt) {
      const timeExpires = (): void => {
        const data = new Date(order.expiresAt).getTime() - new Date().getTime();
        setExpiresAt(Math.round(data / 1000));
      };
      timeExpires();
      timerId = setInterval(timeExpires, 1000);
    }
    if (order?.id) setOrderId(order.id);
    if (order?.ticket.price) setPrice(order?.ticket.price * 100);
    if (stripeKey) setPubKey(stripeKey);
    return () => clearInterval(timerId);
  }, [order]);

  useEffect(() => {
    if (isSuccess) void router.push('/orders');
  }, [isSuccess]);

  if (expiresAt < 0) {
    return <div> Order expired!</div>;
  }

  const onToken = async (token: StripeCard): Promise<void> => {
    await doRequest({ orderId, token: token.id });
  };

  if (!orderId) {
    return <Error404 />;
  }

  return (
    <div className="container">
      <Htag tag="h3">Time left to pay: {expiresAt} seconds</Htag>

      <StripeCheckout token={onToken} stripeKey={pubKey} amount={price} email={userName} />

      {isSuccess && (
        <div className="alert alert-success">
          <Htag tag="h3">Success</Htag>
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          <Htag tag="h3">{error}</Htag>

          <ul className="my-0">
            {!!errorData &&
              errorData.map((err): JSX.Element => {
                return (
                  <li key={err.param}>
                    <span className="error">{err.msg}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

const PageInitProps: FnProps<TypeProps> = async (ctx, client, payload): Promise<TypeProps> => {
  const stripeKey = process.env.STRIPE_PUB_KEY || process.env.NEXT_PUBLIC_STRIPE_PUB_KEY || '';
  try {
    if (!client) throw new Error('Client not found');
    const { orderId } = ctx.query;

    if (!orderId) throw new Error('Ticket not found');
    if (Array.isArray(orderId)) throw new Error('Ticket not found');

    const { data } = await client.get<{ data: Order }>(`${API.orders.getOrder(orderId)}`);
    return { pageName: FirstLevelMenu.Order, ...payload, order: data?.data, stripeKey };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Order, err: e.message, order: null, stripeKey };
    return { pageName: FirstLevelMenu.Order, err: e, order: null, stripeKey };
  }
};

export default withPageLayout<TypeProps>(OrderShow, PageInitProps);
