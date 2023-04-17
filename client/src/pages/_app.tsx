import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@src/styles/globals.scss';

import { IAppContext } from '@src/context/app.context';
import { UserContextProvider } from '@src/context/user.context';
import { buildClient } from '@src/api/build-client';
import { FirstLevelMenu } from '@src/interfaces';
import { API } from '@src/helpers/api';

const App = ({ Component, pageProps, pageName, ...t }: AppProps<IAppContext> & { pageName: string }): JSX.Element => {
  console.log('app=>', pageProps);
  console.dir(t);
  return (
    <>
      <Head>
        <title>{pageProps?.pageName || pageName}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </>
  );
};

App.getInitialProps = async appCtx => {
  try {
    const client = buildClient(appCtx.ctx);
    const { data } = await client.get<{ data: object }>(API.auth.currentuser);

    let pageProps = {};
    if (appCtx?.Component?.getInitialProps) {
      pageProps = await appCtx.Component.getInitialProps(appCtx.ctx);
    }

    return { pageName: FirstLevelMenu.Home, ...data, pageProps };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Home, err: e.message };
    return { pageName: FirstLevelMenu.Home, err: e };
  }
};

export default App;
