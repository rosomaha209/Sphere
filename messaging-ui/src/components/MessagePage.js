import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Messages() {
  const { chatId } = useParams();  // Отримання ID чату з URL
  const [messages, setMessages] = useState([]);  // Стан для збереження повідомлень
  const [participants, setParticipants] = useState([]);  // Стан для збереження учасників чату
  const [newMessage, setNewMessage] = useState('');  // Стан для нового повідомлення

  useEffect(() => {
    fetchMessages();
    fetchParticipants();
  }, [chatId]);  // Завантаження даних при зміні ID чату

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/messaging/messages/?chat_id=${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/messaging/messages/${chatId}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post('http://localhost:8000/messaging/messages/', {
        chat: chatId,
        content: newMessage,
        author_id: "ID of the user (replace with actual user ID)"  // Ваш API має знати ID користувача
      });
      setNewMessage('');
      fetchMessages();  // Оновлення списку повідомлень
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <h2>Chat Messages</h2>
      <h3>Participants</h3>
      <ul>
        {participants.map(participant => (
          <li key={participant.id}>{participant.username} ({participant.email})</li>
        ))}
      </ul>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.author.username}: {message.content}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Messages;
