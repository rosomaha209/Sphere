import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.content}</h1>
      {/* Display more details and components related to the post */}
    </div>
  );
};

export default PostPage;
