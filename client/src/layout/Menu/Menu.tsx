import Link from 'next/link';
import React from 'react';
import cn from 'classnames';

import { useAppOptions } from '@src/context/app.context';
import { firstLevelMenu } from '@src/helpers/helpers';

import styles from './Menu.module.scss';
import { useUserOptions } from '@src/context/user.context';

export const Menu: React.FC = (): JSX.Element => {
  const { firstCategory } = useAppOptions();
  const { userName } = useUserOptions();

  const buildFirstLevel = (): JSX.Element => {
    return (
      <ul className={styles.firstLevelList}>
        {firstLevelMenu.map(m => {
          if (userName && !m.auth) return;
          if (!userName && m.auth) return;
          return (
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
          );
        })}
      </ul>
    );
  };

  return (
    <nav className={styles.menu} role="navigation">
      {buildFirstLevel()}
    </nav>
  );
};
