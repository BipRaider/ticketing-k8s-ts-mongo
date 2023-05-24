import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withPageLayout } from '@src/layout/Layout';

import { Htag } from '@src/components';
import { useRequest } from '@src/hooks';
import { IPageContext } from '@src/context/page.context';
import { ApiErrorData, FirstLevelMenu, Ticket, Order } from '@src/interfaces';
import { FnProps } from '@src/interfaces/pageProps.interface';
import { API } from '@src/helpers/api';

interface TypeProps extends IPageContext, Record<string, unknown> {
  ticket?: Ticket;
}

const TicketShow: React.FC<TypeProps> = ({ ticket }: TypeProps): JSX.Element => {
  const router = useRouter();
  const { doRequest, payload, isSuccess, error, errorData } = useRequest<{ data: Order }, ApiErrorData[]>({
    method: 'post',
    url: API.orders.create,
  });

  const onClick = async (): Promise<void> => {
    await doRequest({ ticketId: ticket?.id });
  };

  useEffect(() => {
    if (payload) {
      void router.push('/order/[orderId]', `/order/${payload?.data.id}`);
    }
  }, [payload]);
  console.dir(payload);
  return (
    <div className="container">
      <Htag tag="h1">{ticket?.title}</Htag>
      <Htag tag="h4">Price:{ticket?.price}</Htag>
      <button className="btn btn-primary" onClick={onClick}>
        Purchase
      </button>
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
  try {
    if (!client) throw new Error('Client not found');
    const { ticketId } = ctx.query;

    if (!ticketId) throw new Error('Ticket not found');
    if (Array.isArray(ticketId)) throw new Error('Ticket not found');

    const { data } = await client.get<{ data: Ticket }>(`${API.tickets.getTickets}/${ticketId}`);

    return { pageName: FirstLevelMenu.AddTicket, ...payload, ticket: data?.data };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Ticket, err: e.message };
    return { pageName: FirstLevelMenu.Ticket, err: e };
  }
};

export default withPageLayout<TypeProps>(TicketShow, PageInitProps);
