import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Імпортуйте Bootstrap стилі

const ParticipantList = ({ participants }) => {
    return (
        <div className="container">
            <ul className="list-group">
                {participants.map(participant => (
                    <li key={participant.id} className="list-group-item">
                        <strong>{participant.first_name}</strong> <span className="text-muted">({participant.email})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParticipantList;
