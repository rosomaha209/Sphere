import React from 'react';
import DeleteMessageButton from './DeleteMessageButton';

const MessageList = ({ messages, fetchMessages }) => {
    return (
        <ul>
            {messages.map(message => (
                <li key={message.id}>
                    {message.author && message.author.profile_pic ? (
                        <img src={message.author.profile_pic} alt={`${message.author.first_name}'s profile`}
                             style={{width: '30px', height: '30px', borderRadius: '50%'}}/>
                    ) : <img src="http://localhost:8000/media/profile_pics/no_foto.jpg" alt="Default profile"
                             style={{width: '30px', height: '30px', borderRadius: '50%'}}/>}
                    {message.author && message.author.first_name ? `${message.author.first_name}: ` : "Anonymous: "}
                    {message.content}
                    <span> - {new Date(message.timestamp).toLocaleTimeString()}</span>
                    <DeleteMessageButton messageId={message.id} authorId={message.author.id} fetchMessages={fetchMessages} />
                </li>
            ))}
        </ul>
    );
};

export default MessageList;
