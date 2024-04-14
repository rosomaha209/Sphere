import React, { useState } from 'react';

const SendMessageForm = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(newMessage);
        setNewMessage(''); // Чистить поле вводу після відправки
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default SendMessageForm;
