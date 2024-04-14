import React from 'react';

const ParticipantList = ({ participants }) => {
    return (
        <ul>
            {participants.map(participant => (
                <li key={participant.id}>
                    {participant.first_name} ({participant.email})
                </li>
            ))}
        </ul>
    );
};

export default ParticipantList;
