import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface CommentCreateProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  postId: string;
  children?: ReactNode;
}
