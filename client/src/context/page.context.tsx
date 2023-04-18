import React, { createContext, PropsWithChildren } from 'react';

import { FirstLevelMenu } from '@src/interfaces/page.interface';

export interface IPageContext extends Record<string, unknown> {
  pageName: FirstLevelMenu;
}

export const AppContext = createContext<IPageContext>({
  pageName: FirstLevelMenu.SignIn,
});

export const usePageOptions = (): IPageContext => React.useContext(AppContext);

export const PageContextProvider = ({ pageName, children }: PropsWithChildren<IPageContext>): JSX.Element => {
  return (
    <AppContext.Provider
      value={{
        pageName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

PageContextProvider;
