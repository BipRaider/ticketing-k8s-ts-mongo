import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { PostsListProps } from './PostsList.props';
import { Posts, GetPosts } from './PostsList.interface';
import { CommentCreate } from '../CommentCreate';
import { CommentList } from '../CommentList';

export const PostsList: React.FC<PostsListProps> = () => {
  const [posts, setPosts] = useState<Posts[]>([]);

  const fetchPosts = async () => {
    const { data } = await axios.get<GetPosts>('http://posts.com/posts');

    setPosts(data?.posts);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="wrapper">
      <button className="btn btn-primary" onClick={fetchPosts}>
        Get list posts
      </button>
      <ul className="d-flex flex-row flex-wrap justify-content-between">
        {posts.length > 0 &&
          posts.map(post => {
            return (
              <li key={post.id} className="card" style={{ width: '30%', margin: '5px' }}>
                <div className="card-body">
                  <h3>{post.title}</h3>
                  <CommentList commentsList={post.comments} />
                  <hr />
                  <CommentCreate postId={post.id} />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
