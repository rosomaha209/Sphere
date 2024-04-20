import React, { useState } from 'react';
import axios from 'axios';
import {useHistory} from "react-router-dom";

const CreatePostForm = () => {
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');  // Припускаємо, що userId зберігається у localStorage
  const history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = {
        content: content,
        author: userId  // Передача ID користувача
      };
      const response = await axios.post('http://127.0.0.1:8000/posts/posts/', postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`  // Додаємо токен авторизації, якщо потрібно
        }
      });
      console.log('Post created:', response.data);
      setContent('');
      history.push('/news-feed');
      // Optional: Redirect to NewsFeed or update state globally
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        required
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostForm;
