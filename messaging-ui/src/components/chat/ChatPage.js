import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ChatList from './ChatList';
import CreateChatForm from './CreateChatForm';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchChatsAndUsers = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8000/users/users/');
        const chatsResponse = await axios.get('http://localhost:8000/messaging/chats/');
        setAllUsers(usersResponse.data);
        setChats(chatsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch chats');
      }
    };

    fetchChatsAndUsers();
  }, []);

  const handleCreateChat = async (chatName, participants) => {
    console.log("Creating chat with name:", chatName, "and participants:", participants);
    try {
      const response = await axios.post('http://localhost:8000/messaging/chats/', {
        name: chatName,
        participants

      });
      console.log(participants)
      history.push(`/chat/${response.data.id}`); // Navigate to the new chat page
      setChats([...chats, response.data]); // Optionally update chat list locally
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const onChatsUpdated = async () => {
    try {
      const response = await axios.get('http://localhost:8000/messaging/chats/');
      setChats(response.data);
    } catch (error) {
      console.error("Failed to fetch chats after update:", error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Chat List</h1>
      <ChatList chats={chats} onChatsUpdated={onChatsUpdated} />
      <h2>Create New Chat</h2>
      <CreateChatForm allUsers={allUsers} onCreateChat={handleCreateChat} />
    </div>
  );
}

export default ChatPage;
