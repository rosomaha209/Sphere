import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const LikeButton = ({ postId }) => {
  const [likes, setLikes] = useState(0);

  const fetchLikes = useCallback(async () => {
    const response = await axios.get(`http://127.0.0.1:8000/posts/likes/?post_id=${postId}`);
    setLikes(response.data.length);
  }, [postId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async () => {
    try {
        await axios.post('/posts/likes/toggle/', { post_id: postId });
        await fetchLikes();
    } catch (error) {
        console.error('Error toggling like:', error);
        if (error.response) {
            console.error('Failed with status:', error.response.status);
        } else {
            console.error('Error without response:', error);
        }
    }
};



  return (
    <button onClick={toggleLike}>
      Like ({likes})
    </button>
  );
};

export default LikeButton;
