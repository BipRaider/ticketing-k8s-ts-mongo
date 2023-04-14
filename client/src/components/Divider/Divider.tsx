import React from 'react';

import cn from 'classnames';

import styles from './Divider.module.scss';
import { DividerProps } from './Divider.props';

export const Divider: React.FC<DividerProps> = ({ className, ...props }: DividerProps): JSX.Element => {
  return <hr className={cn(className, styles.hr)} {...props} />;
};
