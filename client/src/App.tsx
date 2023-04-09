import React from 'react';

import { PostsCreate, PostsList } from './components';

const App: React.FC = () => {
  return (
    <div>
      <main className="container">
        <h2>Post create</h2>
        <PostsCreate />
        <hr />
        <h2>Posts</h2>
        <PostsList />
      </main>
    </div>
  );
};

export default App;
