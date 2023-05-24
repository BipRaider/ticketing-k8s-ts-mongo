import React, { useEffect, useState } from 'react';

import { withPageLayout } from '@src/layout/Layout';

import { Htag } from '@src/components';
import { useRequest } from '@src/hooks';
import { IPageContext } from '@src/context/page.context';
import { ApiErrorData, FirstLevelMenu, Order } from '@src/interfaces';
import { FnProps } from '@src/interfaces/pageProps.interface';
import { API } from '@src/helpers/api';

interface TypeProps extends IPageContext, Record<string, unknown> {
  order?: Order | null;
}

const OrderShow: React.FC<TypeProps> = ({ order }: TypeProps): JSX.Element => {
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>('');

  const { doRequest, isSuccess, error, errorData } = useRequest<Record<string, unknown>, ApiErrorData[]>({
    method: 'post',
    url: API.payments.create,
  });

  const onClick = async (): Promise<void> => {
    await doRequest({ orderId, token: 'tok_visa' });
  };

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

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (expiresAt < 0) {
    return <div> Order expired!</div>;
  }
  return (
    <div className="container">
      <Htag tag="h3">Time left to pay: {expiresAt} seconds</Htag>

      <button className="btn btn-primary" onClick={onClick}>
        Pay
      </button>

      {isSuccess && <span className="success">Success</span>}
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
  try {
    if (!client) throw new Error('Client not found');
    const { orderId } = ctx.query;

    if (!orderId) throw new Error('Ticket not found');
    if (Array.isArray(orderId)) throw new Error('Ticket not found');

    const { data } = await client.get<{ data: Order }>(`${API.orders.getOrder(orderId)}`);

    return { pageName: FirstLevelMenu.Order, ...payload, order: data?.data };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Order, err: e.message, order: null };
    return { pageName: FirstLevelMenu.Order, err: e, order: null };
  }
};

export default withPageLayout<TypeProps>(OrderShow, PageInitProps);
