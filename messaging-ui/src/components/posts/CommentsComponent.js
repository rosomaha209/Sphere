import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CommentsComponent = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/posts/comments/?post_id=${postId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim()) return;

        try {
            await axios.post(`http://127.0.0.1:8000/posts/comments/`, {
                post: postId,
                content: content
            });
            setContent('');
            fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    // Використання .slice() для створення копії та .reverse() для зміни порядку
    const displayedComments = comments.slice().reverse();

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    required
                    className="form-control"
                />
                <button type="submit" className="btn btn-primary mt-2">Post Comment</button>
            </form>
            {comments.length > 1 && (
                <button onClick={() => setShowAllComments(!showAllComments)} className="btn btn-link" style={{color: 'grey', textAlign: 'center'}}>
                    {showAllComments ? 'Сховати коментарі' : `Показати всі коментарі (${comments.length})`}
                </button>
            )}
            <div>
                {showAllComments ? displayedComments.map(comment => (
                    <div key={comment.id} className="media mb-3">
                        <img src={comment.author.profile_pic || 'default-profile.png'} alt="Profile" className="mr-3 rounded-circle" style={{width: '50px', height: '50px'}} />
                        <div className="media-body">
                            <h5 className="mt-0">{comment.author.first_name} {comment.author.last_name}</h5>
                            <p>{comment.content}</p>
                            <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                        </div>
                    </div>
                )) : displayedComments.slice(0, 1).map(comment => (
                    <div key={comment.id} className="media mb-3">
                        <img src={comment.author.profile_pic || 'default-profile.png'} alt="Profile" className="mr-3 rounded-circle" style={{width: '50px', height: '50px'}} />
                        <div className="media-body">
                            <h5 className="mt-0">{comment.author.first_name} {comment.author.last_name}</h5>
                            <p>{comment.content}</p>
                            <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentsComponent;
