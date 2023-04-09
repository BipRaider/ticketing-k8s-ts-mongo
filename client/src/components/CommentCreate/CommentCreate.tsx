import React, { useState } from 'react';
import axios from 'axios';

import { CommentCreateProps } from './CommentCreate.props';

export const CommentCreate: React.FC<CommentCreateProps> = ({ postId }) => {
  const [content, setContent] = useState<string>('');

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      comment: {
        content,
      },
    });

    setContent('');
  };

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);
  };

  return (
    <div>
      <form onSubmit={handlerSubmit}>
        <div className="form-group">
          <label>Comment</label>
          <input className="from-control" value={content} onChange={handlerChange} />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
