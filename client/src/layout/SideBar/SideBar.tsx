import React from 'react';
import cn from 'classnames';

import styles from './SideBar.module.scss';
import { SideBarProps } from './SideBar.props';
import { Menu } from '../Menu';

export const SideBar: React.FC<SideBarProps> = ({ children, className, ...props }: SideBarProps): JSX.Element => {
  return (
    <aside className={cn(className, styles.sidebar)} {...props}>
      <div className={styles.menu}>
        <Menu />
      </div>
      {children}
    </aside>
  );
};
