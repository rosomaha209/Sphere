import React from 'react';
import { Link } from 'react-router-dom';
import DeleteChatButton from './DeleteChatButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatList = ({ chats, onChatsUpdated }) => {
  const currentUserId = localStorage.getItem('userId'); // Завантажуємо ID поточного користувача

  return (
    <ul className="list-group">
      {chats.map(chat => (
        <li key={chat.id} className="list-group-item d-flex justify-content-between align-items-center">
          <Link to={`/chat/${chat.id}`} className="text-decoration-none flex-grow-1">{chat.name}</Link>
          {/* Відображаємо кнопку тільки якщо користувач є творцем чату */}
          {chat.creator === parseInt(currentUserId) && (
            <DeleteChatButton chatId={chat.id} creatorId={chat.creator} onChatsUpdated={onChatsUpdated} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
