import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Імпорт стилів іконок
import '../../styles/LikeButton.css';

const LikeButton = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // Оголошення fetchLikeStatus як useCallback для включення в залежності useEffect
  const fetchLikeStatus = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/posts/likes/like_status/?post_id=${postId}`);
      setLikes(response.data.likesCount);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error fetching like status:', error);
      setLikes(0);
      setLiked(false);
    }
  }, [postId]); // postId включено в залежності useCallback

  useEffect(() => {
    fetchLikeStatus();
  }, [postId, fetchLikeStatus]); // Додавання fetchLikeStatus в залежності useEffect

  const toggleLike = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/posts/likes/like_status/', { post_id: postId });
      fetchLikeStatus();  // Перезавантаження стану після зміни лайка
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="like-button" onClick={toggleLike}>
      <i className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`} style={{ cursor: 'pointer', fontSize: '1.5rem' }}></i>
      <span style={{ marginLeft: '10px', cursor: 'pointer' }}>{likes}</span>
    </div>
  );
};

export default LikeButton;
