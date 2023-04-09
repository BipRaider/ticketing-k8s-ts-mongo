import React, { useState, useEffect } from 'react';

import { CommentListProps } from './CommentList.props';
import { Comment } from './CommentList.interface';

export const CommentList: React.FC<CommentListProps> = ({ commentsList }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [view, setView] = useState<boolean>(false);

  useEffect(() => {
    setComments(commentsList);
    setView(true);
  }, [commentsList]);

  return (
    <div className="wrapper">
      {view && (
        <ul className="d-flex flex-column justify-content-between">
          {comments.length > 0 &&
            comments.map(comment => {
              return (
                <li key={comment.id}>
                  <p>{comment.content}</p>
                  <span>{new Date(comment.createdAt).toUTCString()}</span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};
