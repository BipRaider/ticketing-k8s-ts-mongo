import React, { FunctionComponent } from 'react';

import { AppContextProvider, IAppContext } from '@src/context/app.context';

import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.props';

import { Header } from './Header';
import { SideBar } from './SideBar';
import { Main } from './Main';
import { Footer } from './Footer';

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

/*** Wrapper for all components.*/
export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
  return function withLayoutComponent(props: T): JSX.Element {
    return (
      <AppContextProvider menu={props.menu} firstCategory={props.firstCategory}>
        <Layout>
          <Component {...props} />
        </Layout>
      </AppContextProvider>
    );
  };
};
