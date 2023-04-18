import React, { createContext, PropsWithChildren, useState } from 'react';

export interface IAppContext {
  userName?: string;
  setUserName?: React.Dispatch<React.SetStateAction<string>>;
  email?: string;
}

export const AppContext = createContext<IAppContext>({ userName: '' });

export const useAppOptions = (): IAppContext => React.useContext(AppContext);

export const AppContextProvider = ({ email, children }: PropsWithChildren<IAppContext>): JSX.Element => {
  const [userName, setUserName] = useState<string>(email ? email : '');

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
