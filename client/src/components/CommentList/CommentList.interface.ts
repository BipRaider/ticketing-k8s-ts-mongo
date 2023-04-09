export interface Comment {
  id: string;
  createdAt: Date;
  content: string;
}

export interface PostWithComment {
  id: string;
  comments: Comment[];
}

export interface GetComments {
  post: PostWithComment | null;
  time: Date;
  service: string;
}
