import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Comment } from './CommentList.interface';

export interface CommentListProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  commentsList: Comment[];
  children?: ReactNode;
}
