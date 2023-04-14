import React from 'react';

// import axios from 'axios';

import { withLayout } from '@src/layout/Layout';

interface TypeProps extends Record<string, unknown> {}

const CurrentUser = (_data: TypeProps): JSX.Element => {
  return <>Type page CurrentUser: </>;
};

export default withLayout(CurrentUser);
