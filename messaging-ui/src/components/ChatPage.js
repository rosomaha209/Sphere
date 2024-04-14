import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [newChatName, setNewChatName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const history = useHistory(); // Правильне місце для оголошення useHistory

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/users/users/');
        setAllUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/messaging/chats/');
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
        setError('Failed to fetch chats');
      }
    };

    fetchUsers();
    fetchChats();
  }, []);

  const handleCreateChat = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/messaging/chats/', {
        name: newChatName,
        participants: participants
      });
      setNewChatName('');
      setParticipants([]);
      history.push(`/chat/${response.data.id}`); // Переходимо до сторінки нового чату
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

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
      <h2>Create New Chat</h2>
      <form onSubmit={handleCreateChat}>
        <input
          type="text"
          placeholder="Chat Name"
          value={newChatName}
          onChange={e => setNewChatName(e.target.value)}
        />
        <select multiple value={participants} onChange={e => setParticipants([...e.target.selectedOptions].map(o => o.value))}>
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
        <button type="submit">Create Chat</button>
      </form>
    </div>
  );
}

export default ChatPage;
