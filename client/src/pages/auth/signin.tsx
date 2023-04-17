import React from 'react';

import { withLayout } from '@src/layout/Layout';
import { SignInForm } from '@src/views';
import { Htag } from '@src/components';

interface TypeProps extends Record<string, unknown> {}

const SignInPage: React.FC<TypeProps> = (_props: TypeProps): JSX.Element => {
  return (
    <>
      <Htag tag="h1">Sign In</Htag>
      <SignInForm />
    </>
  );
};

export default withLayout(SignInPage);
