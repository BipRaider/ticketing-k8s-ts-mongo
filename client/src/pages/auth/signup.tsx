import React from 'react';

import { withPageLayout } from '@src/layout/Layout';
import { SignUpForm } from '@src/views';
import { Htag } from '@src/components';
import { IPageContext } from '@src/context/page.context';
import { FirstLevelMenu } from '@src/interfaces';

interface TypeProps extends IPageContext, Record<string, unknown> {}

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

export default withPageLayout<TypeProps>(SignUpPage, SignUpPageInitProps);
