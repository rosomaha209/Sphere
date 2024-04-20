import React from 'react';
import DeleteMessageButton from './DeleteMessageButton';
import 'bootstrap/dist/css/bootstrap.min.css'; // Переконайтеся, що стилі Bootstrap імпортовані

const MessageList = ({ messages, fetchMessages }) => {
    return (
        <ul className="list-group">
            {messages.map(message => (
                <li key={message.id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="media align-items-center">
                        <img src={message.author && message.author.profile_pic ? message.author.profile_pic : "http://localhost:8000/media/profile_pics/no_foto.jpg"}
                             alt={message.author ? `${message.author.first_name}'s profile` : "Default profile"}
                             className="rounded-circle mr-3"
                             style={{width: '40px', height: '40px'}} />
                        <div className="media-body">
                            <h6 className="mt-0 mb-1">
                                {message.author ? `${message.author.first_name}` : "Anonymous"}
                                <small className="text-muted"> - {new Date(message.timestamp).toLocaleTimeString()}</small>
                            </h6>
                            {message.content}
                        </div>
                    </div>
                    <DeleteMessageButton messageId={message.id} authorId={message.author.id} fetchMessages={fetchMessages} />
                </li>
            ))}
        </ul>
    );
};

export default MessageList;
