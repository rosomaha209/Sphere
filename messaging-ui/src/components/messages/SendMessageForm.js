import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Імпортуйте Bootstrap стилі, якщо вони ще не імпортовані

const SendMessageForm = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(newMessage);
        setNewMessage(''); // Чистить поле вводу після відправки
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="submit" id="button-addon2">Send</button>
                </div>
            </div>
        </form>
    );
};

export default SendMessageForm;
