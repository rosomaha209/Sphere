import React from 'react';
import DOMPurify from 'dompurify';
import LikeButton from './LikeButton';
import CommentsComponent from "./CommentsComponent";
import DeletePostButton from './DeletePostButton';
const Post = ({ post }) => {
  const userId = localStorage.getItem('userId');


  const cleanContent = DOMPurify.sanitize(post.content);

  return (
    <div className="post card mb-3" style={{ width: '1000px' , maxWidth: '1000px' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div className="media">
            <img src={post.author.profile_pic} alt="Profile" className="mr-3 rounded-circle" style={{ width: '50px', height: '50px' }} />
            <div className="media-body">
              <h5 className="mt-0">{post.author.first_name} {post.author.last_name}</h5>
              <p>{new Date(post.created_at).toLocaleDateString()}</p>
              <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
            </div>
          </div>
          {post.author.id.toString() === userId && (
            <div style={{ marginLeft: 'auto' }}>
              <DeletePostButton postId={post.id} onPostDeleted={() => window.location.reload()} />
            </div>
          )}
        </div>
        <div className="comment-section mt-3 w-75 mx-auto shadow-sm p-2 border">
          <CommentsComponent postId={post.id}/>
        </div>
        <div className="d-flex justify-content-end">
          <LikeButton postId={post.id}/>
        </div>
      </div>
    </div>
  );
};

export default Post;