import React from 'react';
import { Link } from 'react-router-dom';
import DeleteChatButton from './DeleteChatButton';

const ChatList = ({ chats, onChatsUpdated }) => {
  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>
          <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
          <DeleteChatButton chatId={chat.id} creatorId={chat.creator} onChatsUpdated={onChatsUpdated} />
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
