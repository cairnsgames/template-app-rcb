import React from 'react';
import { ForumProvider } from './forum/ForumProvider';
import ForumLayout from './forum/ForumLayout';
import "./app.scss";

const App = () => {
  const user = { id: 1, name: 'User1' }; // Sample user object

  return (
    <ForumProvider user={user}>
      <ForumLayout />
    </ForumProvider>
  );
};

export default App;
