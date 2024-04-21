import React from 'react';
import LikeButton from './LikeButton';
import CommentsComponent from "./CommentsComponent";

const Post = ({ post }) => {
  return (
    <div className="post card mb-3">
      <div className="card-body">
        <div className="media">
          <img src={post.author.profile_pic} alt="Profile" className="mr-3 rounded-circle" style={{ width: '50px', height: '50px' }} />
          <div className="media-body">
            <h5 className="mt-0">{post.author.first_name} {post.author.last_name}</h5>
            <p>{new Date(post.created_at).toLocaleDateString()}</p>
            <p>{post.content}</p>
          </div>
        </div>
        <div className="comment-section mt-3 w-75 mx-auto shadow-sm p-2 border">
          <CommentsComponent postId={post.id}/>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <div className="flex-grow-1">

          </div>
          <LikeButton postId={post.id}/>
        </div>
      </div>
    </div>
  );
};

export default Post;
