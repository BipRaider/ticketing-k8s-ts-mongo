import React from 'react';
import { Htag } from '../components';
import { withPageLayout } from '../layout/Layout';

export function Error404(): JSX.Element {
  return (
    <>
      <Htag tag="h1">Ошибка 404</Htag>
    </>
  );
}

export default withPageLayout(Error404);
