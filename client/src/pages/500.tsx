import React from 'react';

import { IPageContext } from '@src/context/page.context';
import { FirstLevelMenu, FnProps } from '@src/interfaces';

import { Htag } from '../components';
import { withPageLayout } from '../layout';

interface PageProps extends IPageContext, Record<string, unknown> {}

function Error500(): JSX.Element {
  return (
    <div className="container">
      <Htag tag="h1">{FirstLevelMenu.Error500}</Htag>
    </div>
  );
}

const PageInitProps: FnProps<PageProps> = async (_ctx, _client, payload): Promise<PageProps> => {
  try {
    return { pageName: FirstLevelMenu.Error500, ...payload };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Error500, err: e.message };
    return { pageName: FirstLevelMenu.Error500, err: e };
  }
};
export default withPageLayout<PageProps>(Error500, PageInitProps);
