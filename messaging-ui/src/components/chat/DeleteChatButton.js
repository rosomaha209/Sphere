import React from 'react';
import axios from 'axios';

const DeleteChatButton = ({ chatId, creatorId, isSuperuser, onChatsUpdated }) => {
    const currentUserId = localStorage.getItem('userId'); // Витягування ID поточного користувача

    const handleDelete = async () => {
        if (currentUserId === creatorId.toString() || isSuperuser) {
            if (window.confirm('Are you sure you want to delete this chat?')) {
                try {
                    await axios.delete(`http://localhost:8000/messaging/chats/${chatId}/`);
                    onChatsUpdated();
                    alert('Chat deleted successfully');
                } catch (error) {
                    console.error('Failed to delete chat:', error);
                    alert('Failed to delete chat');
                }
            }
        } else {
            alert('You do not have permission to delete this chat.');
        }
    };

    return (
        <button onClick={handleDelete} disabled={!(currentUserId === creatorId.toString() || isSuperuser)}>
            Delete Chat
        </button>
    );
};

export default DeleteChatButton;
