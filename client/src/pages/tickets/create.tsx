import React from 'react';

import { withPageLayout } from '@src/layout/Layout';
import { TicketCreateForm } from '@src/views';
import { Htag } from '@src/components';
import { IPageContext } from '@src/context/page.context';
import { FirstLevelMenu } from '@src/interfaces';
import { FnProps } from '@src/interfaces/pageProps.interface';

interface TypeProps extends IPageContext, Record<string, unknown> {}

const TicketCreate: React.FC<TypeProps> = (_props: TypeProps): JSX.Element => {
  return (
    <>
      <Htag tag="h1">Add ticket</Htag>
      <TicketCreateForm />
    </>
  );
};

const PageInitProps: FnProps<TypeProps> = async (_, _cln, payload): Promise<TypeProps> => {
  return { pageName: FirstLevelMenu.AddTicket, ...payload };
};

export default withPageLayout<TypeProps>(TicketCreate, PageInitProps);
