import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
console.log('Rendering ChatPage', chats);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/messaging/chats/');
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
        setError('Failed to fetch chats');
      }
    };
    fetchChats();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

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
