import React from 'react';
import cn from 'classnames';

import { useAppOptions } from '@src/context/app.context';

import styles from './Header.module.scss';
import { HeaderProps } from './Header.props';

export const Header: React.FC<HeaderProps> = ({ children, className, ...props }: HeaderProps): JSX.Element => {
  const { userName } = useAppOptions();

  return (
    <header className={cn(className, styles.header)} {...props}>
      <div>{userName && <span>{userName}</span>}</div>
      {children}
    </header>
  );
};
