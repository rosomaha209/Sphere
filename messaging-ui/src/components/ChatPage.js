import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ChatPage() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await axios.get('http://localhost:8000/messaging/chats/');
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    }

    fetchChats();
  }, []);

  return (
    <div>
      <h1>Chat List</h1>
      <ul>
        {chats.map(chat => (
          <li key={chat.id}>
            <Link to={`/chat/${chat.id}`}>{chat.name}</Link> - Participants: {chat.participants.map(p => p.email).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatPage;
