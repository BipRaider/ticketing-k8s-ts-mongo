import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PostsListProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
}
