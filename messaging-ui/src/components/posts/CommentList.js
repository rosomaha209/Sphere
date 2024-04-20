import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/posts/comments/?post_id=${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>
          {comment.content}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
