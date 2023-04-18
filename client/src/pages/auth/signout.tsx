import React from 'react';

import { withPageLayout } from '@src/layout/Layout';
import { SignOut } from '@src/views';

interface TypeProps extends Record<string, unknown> {}

const SignOutPage = (_data: TypeProps): JSX.Element => {
  return <SignOut></SignOut>;
};

export default withPageLayout(SignOutPage);
