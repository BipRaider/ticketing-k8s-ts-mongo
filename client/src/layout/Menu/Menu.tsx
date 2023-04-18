import Link from 'next/link';
import React from 'react';
import cn from 'classnames';

import { usePageOptions } from '@src/context/page.context';
import { firstLevelMenu } from '@src/helpers/helpers';

import styles from './Menu.module.scss';
import { useAppOptions } from '@src/context/app.context';

export const Menu: React.FC = (): JSX.Element => {
  const { firstCategory } = usePageOptions();
  const { userName } = useAppOptions();

  const buildFirstLevel = (): JSX.Element => {
    return (
      <ul className={styles.firstLevelList}>
        {firstLevelMenu.map(m => {
          if (userName && !m.auth) return;

          if (!userName && m.private) return;

          return (
            <li key={m.id} className="nav-item">
              <Link
                href={m.href}
                className={cn(styles.firstLevel, {
                  [styles.firstLevelActive]: m.id == firstCategory,
                })}
              >
                <span>{m.label}</span>
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
