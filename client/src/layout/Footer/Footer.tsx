import React from 'react';
import cn from 'classnames';
import { format } from 'date-fns';

import styles from './Footer.module.scss';
import { FooterProps } from './Footer.props';

export const Footer: React.FC<FooterProps> = ({ className, ...props }: FooterProps): JSX.Element => {
  return (
    <footer className={cn(className, styles.footer)} {...props}>
      <div>© 2020 - {format(new Date(), 'yyyy')} protect</div>

      <a href="#" target="_blank">
        protect
      </a>
      <a href="#" target="_blank">
        protect
      </a>
    </footer>
  );
};
