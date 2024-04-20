import React from 'react';
import CommentList from './CommentList';  // Припускаємо, що ви вже маєте цей компонент
import LikeButton from './LikeButton';  // Припускаємо, що ви вже маєте цей компонент

const Post = ({ post }) => {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <LikeButton postId={post.id} />
      <CommentList postId={post.id} />
    </div>
  );
};

export default Post;
