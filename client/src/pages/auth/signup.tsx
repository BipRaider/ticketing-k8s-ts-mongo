import React from 'react';

import { withLayout } from '@src/layout/Layout';
import { SignUpForm } from '@src/views';
import { Htag } from '@src/components';

interface TypeProps extends Record<string, unknown> {}

const SignUpPage: React.FC<TypeProps> = (_data: TypeProps): JSX.Element => {
  return (
    <>
      <Htag tag="h1">Sign Up</Htag>
      <SignUpForm />
    </>
  );
};

export default withLayout(SignUpPage);
