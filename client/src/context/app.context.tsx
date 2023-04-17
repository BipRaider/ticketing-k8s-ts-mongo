import React, { createContext, PropsWithChildren, memo } from 'react';

import { FirstLevelMenu } from '@src/interfaces/page.interface';

export interface IAppContext extends Record<string, unknown> {
  pageName: FirstLevelMenu;
}

export const AppContext = createContext<IAppContext>({
  pageName: FirstLevelMenu.SignIn,
});

export const useAppOptions = (): IAppContext => React.useContext(AppContext);

export const AppContextProvider = ({ pageName, children }: PropsWithChildren<IAppContext>): JSX.Element => {
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

export const MemoAppContextProvider = memo(AppContextProvider);
