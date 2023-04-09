import React, { useState } from 'react';
import axios from 'axios';

import { PostsCreateProps } from './PostsCreate.props';
import styles from './PostsCreate.module.css';

export const PostsCreate: React.FC<PostsCreateProps> = () => {
  const [title, setTitle] = useState<string>('');

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.post('http://posts.com/posts/create', {
      post: {
        title,
      },
    });

    setTitle('');
  };

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTitle(value);
  };

  return (
    <div className={styles.posts}>
      <form onSubmit={handlerSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="from-control" value={title} onChange={handlerChange} />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
