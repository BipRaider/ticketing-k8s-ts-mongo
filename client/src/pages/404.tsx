import React from 'react';

import { IPageContext } from '@src/context/page.context';
import { FirstLevelMenu, FnProps } from '@src/interfaces';

import { Htag } from '../components';
import { withPageLayout } from '../layout/Layout';

interface PageProps extends IPageContext, Record<string, unknown> {}

export function Error404(): JSX.Element {
  return (
    <div className="container">
      <Htag tag="h1">{FirstLevelMenu.Error404}</Htag>
    </div>
  );
}

const PageInitProps: FnProps<PageProps> = async (_ctx, _client, payload): Promise<PageProps> => {
  try {
    return { pageName: FirstLevelMenu.Error404, ...payload };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Error404, err: e.message };
    return { pageName: FirstLevelMenu.Error404, err: e };
  }
};
export default withPageLayout<PageProps>(Error404, PageInitProps);
