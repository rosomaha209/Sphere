import React from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Імпортуйте Bootstrap іконки

const DeleteMessageButton = ({ messageId, authorId, fetchMessages }) => {
    const currentUserId = localStorage.getItem('userId'); // Завжди рядок
    console.log("Current User ID:", currentUserId, "Author ID:", authorId);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await axios.delete(`http://localhost:8000/messaging/messages/${messageId}/`);
                fetchMessages(); // Оновлення списку повідомлень
            } catch (error) {
                console.error('Failed to delete message:', error);
                alert('Failed to delete message');
            }
        }
    };

    // Переконуємось, що обидва ID - рядки для коректного порівняння
    const canDelete = currentUserId === authorId.toString();

    return (
        <>
            {canDelete && (
                <button onClick={handleDelete} className="btn btn-sm"
                        style={{marginLeft: '10px', backgroundColor: 'transparent', color: 'red', border: 'none'}}>
                    <i className="bi bi-x-lg"></i>
                </button>
            )}
        </>
    );
};

export default DeleteMessageButton;
