import React from 'react';
import axios from 'axios';

const DeletePostButton = ({ postId, onPostDeleted }) => {

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/posts/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Використання токена для авторизації
        }
      });
      onPostDeleted(); // Виклик функції для оновлення списку постів
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-link p-0 m-0" style={{border: 'none', background: 'none'}}>
      <i className="bi bi-x-lg"></i>
    </button>
  );
};

export default DeletePostButton;
