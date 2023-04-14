import React, { createContext, PropsWithChildren, useState } from 'react';

export interface IUserContext {
  userName?: string;
  setUserName?: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<IUserContext>({ userName: '' });

export const useUserOptions = (): IUserContext => React.useContext(UserContext);

export const UserContextProvider = ({ children }: PropsWithChildren<IUserContext>): JSX.Element => {
  const [userName, setUserName] = useState<string>('');

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
