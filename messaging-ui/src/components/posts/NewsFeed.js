import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePostForm from './CreatePostForm';
import Post from './Post';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);

  // Визначення функції fetchPosts як зовнішньої функції, щоб вона могла бути передана у CreatePostForm
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/posts/posts/');
      // Сортування постів у порядку від найновіших до найстаріших
      const sortedPosts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <CreatePostForm onPostCreated={fetchPosts} />
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default NewsFeed;
