import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PostsCreateProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
}
