import React from 'react';

import { withLayout } from '@src/layout/Layout';
import { SignUpForm } from '@src/views';
import { Htag } from '@src/components';
import { IAppContext } from '@src/context/app.context';
import { FirstLevelMenu } from '@src/interfaces';

interface TypeProps extends IAppContext, Record<string, unknown> {}

const SignUpPage: React.FC<TypeProps> = (props: TypeProps): JSX.Element => {
  return (
    <>
      <Htag tag="h1">{props.pageName}</Htag>
      <SignUpForm />
    </>
  );
};

const SignUpPageInitProps = async (): Promise<TypeProps> => {
  return { pageName: FirstLevelMenu.SignUp };
};

export default withLayout<TypeProps>(SignUpPage, SignUpPageInitProps);
