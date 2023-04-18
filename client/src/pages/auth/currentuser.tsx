import React from 'react';

import { withPageLayout } from '@src/layout/Layout';

interface TypeProps extends Record<string, unknown> {}

const CurrentUser = (_data: TypeProps): JSX.Element => {
  return <>Type page CurrentUser: </>;
};

export default withPageLayout(CurrentUser);
