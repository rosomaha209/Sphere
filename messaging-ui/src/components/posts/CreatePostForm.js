import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    <form onSubmit={handleSubmit} className="position-relative" style={{ width: '1000px' , maxWidth: '1000px' }}>
      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="Write something..."
        className="form-control"
        style={{paddingRight: '2.5rem' }}
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
