import React from 'react';
import axios from 'axios';

const DeleteCommentButton = ({ commentId, onCommentDeleted }) => {


  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/posts/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Токен авторизації
        }
      });
      onCommentDeleted(); // Оновлення коментарів після видалення
      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-link text-danger p-0 m-0" style={{border: 'none', background: 'none'}}>
      <i className="bi bi-x-lg"></i>
    </button>
  );
};

export default DeleteCommentButton;
