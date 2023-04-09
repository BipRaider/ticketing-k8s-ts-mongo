import { Comment } from '../CommentList';

export interface Post {
  id: string;
  title: string;
}

export interface Posts extends Post {
  comments: Comment[];
}

export interface GetPosts {
  posts: Posts[];
  time: Date;
  service: string;
}
