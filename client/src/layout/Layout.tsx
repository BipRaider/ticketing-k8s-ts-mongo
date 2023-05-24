import React, { FunctionComponent } from 'react';
import { NextPage, NextPageContext } from 'next';

import { PageContextProvider, IPageContext } from '@src/context/page.context';

import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.props';

import { Header } from './Header';
import { SideBar } from './SideBar';
import { Main } from './Main';
import { Footer } from './Footer';
import { AxiosInstance } from 'axios';
import { FnProps } from '@src/interfaces/pageProps.interface';

/*** Main page to view. */
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <SideBar />
      </Header>
      <Main className={styles.main}>{children}</Main>
      <Footer className={styles.footer} />
    </div>
  );
};

/*** Wrapper for all page components.*/
export const withPageLayout = <T extends Record<string, unknown> & IPageContext>(
  Component: FunctionComponent<T>,
  fn?: FnProps<T>,
): NextPage<T> => {
  function withPageLayoutComponent(props: T): JSX.Element {
    return (
      <PageContextProvider pageName={props.pageName}>
        <Layout>
          <Component {...props} />
        </Layout>
      </PageContextProvider>
    );
  }

  if (fn) withPageLayoutComponent.getInitialProps = fn;

  return withPageLayoutComponent;
};
