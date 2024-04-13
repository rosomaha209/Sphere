import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Messages() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, [chatId]);

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/messaging/messages/?chat_id=${chatId}`);
            setMessages(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setError('Failed to load messages');
            setIsLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:8000/messaging/messages/', {
                chat: chatId,
                content: newMessage,
                author_id: localStorage.getItem('userId') // Assume you store user ID in local storage
            });
            setNewMessage('');
            fetchMessages(); // Refresh messages after sending
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (isLoading) {
        return <p>Loading messages...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Chat Messages</h2>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <img src={message.author.profile_pic} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        {message.author.username}: {message.content}
                        <span> - {new Date(message.timestamp).toLocaleTimeString()}</span>
                    </li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Messages;
