import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MessageList from './MessageList';
import ParticipantList from './ParticipantList';
import SendMessageForm from './SendMessageForm';

function Messages() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const messagesUrl = `http://localhost:8000/messaging/messages/?chat_id=${chatId}`;
            const participantsUrl = `http://localhost:8000/messaging/chats/${chatId}/participants`;
            const [messagesResponse, participantsResponse] = await Promise.all([
                axios.get(messagesUrl),
                axios.get(participantsUrl)
            ]);
            setMessages(messagesResponse.data);
            setParticipants(participantsResponse.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSendMessage = async (newMessage) => {
        if (!newMessage.trim()) return;

        try {
            const postData = {
                chat: chatId,
                content: newMessage
            };
            const response = await axios.post('http://localhost:8000/messaging/messages/', postData);
            setMessages([...messages, response.data]); // Додає нове повідомлення до списку без перезавантаження
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
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
            <MessageList messages={messages} fetchMessages={fetchData} />
            <h3>Participants</h3>
            <ParticipantList participants={participants} />
            <SendMessageForm onSendMessage={handleSendMessage} />
        </div>
    );
}

export default Messages;
