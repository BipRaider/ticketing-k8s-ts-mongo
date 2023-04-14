import React from 'react';
import cn from 'classnames';

import { useUserOptions } from '@src/context/user.context';

import styles from './Header.module.scss';
import { HeaderProps } from './Header.props';

export const Header: React.FC<HeaderProps> = ({ children, className, ...props }: HeaderProps): JSX.Element => {
  const { userName } = useUserOptions();

  return (
    <header className={cn(className, styles.header)} {...props}>
      <div>{userName && <span>{userName}</span>}</div>
      {children}
    </header>
  );
};
