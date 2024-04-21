import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Переконайтесь, що іконки Bootstrap підключені

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = {
        content: content,
        author: userId
      };
      await axios.post('http://127.0.0.1:8000/posts/posts/', postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContent('');
      onPostCreated();
      history.push('/news-feed');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="position-relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        required
        className="form-control"
        style={{paddingRight: '2.5rem'}}
      />
      <button
        type="submit"
        className="btn btn-link position-absolute"
        style={{right: '10px', bottom: '10px', color: '#0d6efd'}}
      >
        <i className="bi bi-send-fill"></i>
      </button>
    </form>
  );
};

export default CreatePostForm;
