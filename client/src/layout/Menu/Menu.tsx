import Link from 'next/link';

import cn from 'classnames';
import React, { useContext } from 'react';

import { AppContext } from '@src/context/app.context';
import { firstLevelMenu } from '@src/helpers/helpers';

import styles from './Menu.module.scss';

export const Menu: React.FC = (): JSX.Element => {
  const { firstCategory } = useContext(AppContext);

  const buildFirstLevel = (): JSX.Element => {
    return (
      <ul className={styles.firstLevelList}>
        {firstLevelMenu.map(m => (
          <li key={m.route}>
            <Link
              href={`/${m.route}`}
              className={cn(styles.firstLevel, {
                [styles.firstLevelActive]: m.id == firstCategory,
              })}
            >
              <span>{m.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className={styles.menu} role="navigation">
      {buildFirstLevel()}
    </nav>
  );
};
