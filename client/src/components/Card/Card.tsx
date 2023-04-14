import { ForwardedRef, forwardRef } from 'react';
import cn from 'classnames';

import styles from './Card.module.scss';
import { CardProps } from './Card.props';

const CardItem = (
  { color = 'white', children, className, ...props }: CardProps,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element => {
  return (
    <div
      className={cn(styles.card, className, {
        [styles.blue]: color == 'blue',
      })}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card = forwardRef(CardItem);
