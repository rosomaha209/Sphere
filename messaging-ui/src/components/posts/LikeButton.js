import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Імпорт стилів іконок

import '../../styles/LikeButton.css';

const LikeButton = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/posts/likes/?post_id=${postId}`);
      const response2 = await axios.get(`http://127.0.0.1:8000/posts/likes/check/?post_id=${postId}`);
      setLikes(response.data.length);
      setLiked(response2.data.liked);  // Перевірте, що сервер дійсно повертає це поле
      console.log("Liked by user:", response2.data.liked);
    } catch (error) {
      console.error('Error fetching likes:', error);
      setLikes(0);
      setLiked(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async () => {
    try {
      // Тільки виконуємо зміну статусу лайка
      await axios.post('http://127.0.0.1:8000/posts/likes/toggle/', { post_id: postId });
      // Потім перезавантажуємо дані
      fetchLikes();
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
