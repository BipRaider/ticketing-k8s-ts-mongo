import Head from 'next/head';
import { NextPage, NextPageContext } from 'next';

import { withLayout } from '@src/layout/Layout';
import { IAppContext } from '@src/context/app.context';
import { FirstLevelMenu } from '@src/interfaces';
import { API } from '@src/helpers/api';
import { buildClient } from '@src/api/build-client';

interface HomePageProps extends IAppContext, Record<string, unknown> {}

const HomePage: NextPage<HomePageProps> = (props): JSX.Element => {
  return (
    <>
      <Head>
        <title>{props.pageName}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{props.pageName}</h1>
    </>
  );
};

const HomePageInitProps = async (ctx: NextPageContext): Promise<HomePageProps> => {
  try {
    const client = buildClient(ctx);
    const { data } = await client.get<{ data: object }>(API.auth.currentuser);
    return { pageName: FirstLevelMenu.Home, ...data };
  } catch (e) {
    if (e instanceof Error) return { pageName: FirstLevelMenu.Home, err: e.message };
    return { pageName: FirstLevelMenu.Home, err: e };
  }
};

export default withLayout<HomePageProps>(HomePage, HomePageInitProps);
