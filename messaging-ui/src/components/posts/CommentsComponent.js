import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DeleteCommentButton from './DeleteCommentButton';

const CommentsComponent = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [canComment, setCanComment] = useState(true);
    const userId = localStorage.getItem('userId');

    const fetchCommentsAndPermissions = useCallback(async () => {
        try {
            const commentsResponse = await axios.get(`http://127.0.0.1:8000/posts/comments/?post_id=${postId}`);
            setComments(commentsResponse.data);

            const permissionResponse = await axios.get(`http://127.0.0.1:8000/posts/comment-permissions/?user_id=${userId}`);
            setCanComment(permissionResponse.data.can_comment);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Не вдалося завантажити коментарі або дозвіл на коментування.');
        }
    }, [postId, userId]);

    useEffect(() => {
        fetchCommentsAndPermissions();
    }, [fetchCommentsAndPermissions]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim() ) {
            alert('Не можна коментувати: немає змісту коментаря або відсутній дозвіл.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/posts/comments/', { post: postId, content });
            setContent('');
            fetchCommentsAndPermissions();
        } catch (error) {
            console.log(postId, content);
            console.error('Error posting comment:', error);
            alert('Не вдалося надіслати коментар.');
        }
    };

    return (
        <div>
            {canComment ? (
                <form onSubmit={handleSubmit}>
                    <div className="position-relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write a comment..."
                            required
                            className="form-control pl-4 pr-5"
                            style={{paddingRight: '2.5rem'}}
                        />
                        <button type="submit" className="btn position-absolute" style={{
                            bottom: '-30px',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'none'
                        }}>
                            <i className="bi bi-send-fill" style={{fontSize: '1.5rem', color: '#007bff'}}></i>
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-center">Коментування цього поста заборонено автором.</p>
            )}
            {comments.length > 1 && (
                <button onClick={() => setShowAllComments(!showAllComments)} className="btn btn-link"
                        style={{color: 'grey', textAlign: 'center'}}>
                    {showAllComments ? 'Сховати коментарі' : `Показати всі коментарі (${comments.length})`}
                </button>
            )}
            <div>
                {showAllComments ? comments.map(comment => (
                    <div key={comment.id} className="media mb-3">
                        <img src={comment.author.profile_pic || 'default-profile.png'} alt="Profile"
                             className="mr-3 rounded-circle" style={{width: '50px', height: '50px', margin: '10px'}} />
                        <div className="media-body">
                            <h5 className="mt-0">{comment.author.first_name} {comment.author.last_name}</h5>
                            <p>{comment.content}</p>
                            <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                            {comment.author.id.toString() === userId && (
                                <DeleteCommentButton commentId={comment.id} onCommentDeleted={fetchCommentsAndPermissions} />
                            )}
                        </div>
                    </div>
                )) : comments.slice(0, 1).map(comment => (
                    <div key={comment.id} className="media mb-3 position-relative">
                        <img src={comment.author.profile_pic || 'default-profile.png'} alt="Profile" className="mr-3 rounded-circle" style={{width: '50px', height: '50px', margin: '10px'}} />
                        {comment.author.id.toString() === userId && (
                            <div className="position-absolute" style={{top: 0, right: 0}}>
                                <DeleteCommentButton commentId={comment.id} onCommentDeleted={fetchCommentsAndPermissions} />
                            </div>
                        )}
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
