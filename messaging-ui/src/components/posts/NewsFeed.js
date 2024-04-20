import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Post from './Post';  // Передбачається, що у вас є компонент Post для відображення деталей поста

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/posts/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Link to="/create-post">Create New Post</Link> {/* Кнопка для переходу на сторінку створення посту */}
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default NewsFeed;
