import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateChatForm = ({ allUsers, onCreateChat }) => {
  const [newChatName, setNewChatName] = useState('');
  const [participants, setParticipants] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const participantIds = participants.map(id => parseInt(id));
    onCreateChat(newChatName, participantIds);
    setNewChatName('');
    setParticipants([]);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-group">
        <label htmlFor="chatName">Chat Name</label>
        <input
          type="text"
          className="form-control"
          id="chatName"
          placeholder="Enter chat name"
          value={newChatName}
          onChange={e => setNewChatName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="participants">Select Participants</label>
        <select
          multiple
          className="form-control"
          id="participants"
          value={participants}
          onChange={e => setParticipants([...e.target.selectedOptions].map(option => option.value))}
        >
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Create Chat</button>
    </form>
  );
};

export default CreateChatForm;
