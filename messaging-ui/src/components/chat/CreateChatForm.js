import React, { useState } from 'react';

const CreateChatForm = ({ allUsers, onCreateChat }) => {
  const [newChatName, setNewChatName] = useState('');
  const [participants, setParticipants] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Переконайтеся, що participants передаються як масив чисел, а не рядків
    const participantIds = participants.map(id => parseInt(id));
    onCreateChat(newChatName, participantIds);
    setNewChatName('');
    setParticipants([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Chat Name"
        value={newChatName}
        onChange={e => setNewChatName(e.target.value)}
      />
      <select multiple value={participants} onChange={e => setParticipants([...e.target.selectedOptions].map(option => option.value))}>
        {allUsers.map(user => (
          <option key={user.id} value={user.id}>{user.email}</option>
        ))}
      </select>
      <button type="submit">Create Chat</button>
    </form>
  );
};

export default CreateChatForm;
