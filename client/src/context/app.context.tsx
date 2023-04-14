import React, { createContext, PropsWithChildren, useState, memo } from 'react';

import { MenuItem } from '@src/interfaces/menu.interface';
import { FirstLevelMenu } from '@src/interfaces/page.interface';

export interface IAppContext {
  menu: MenuItem[];
  firstCategory: FirstLevelMenu;
  setMenu?: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export const AppContext = createContext<IAppContext>({
  menu: [],
  firstCategory: FirstLevelMenu.SignIn,
});

export const AppContextProvider = ({ menu, firstCategory, children }: PropsWithChildren<IAppContext>): JSX.Element => {
  const [menuState, setMenu] = useState<MenuItem[]>(menu);

  return (
    <AppContext.Provider
      value={{
        menu: menuState,
        firstCategory,
        setMenu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const MemoAppContextProvider = memo(AppContextProvider);
