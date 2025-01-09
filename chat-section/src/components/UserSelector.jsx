import React from 'react';

const UserSelector = ({ users, onUserChange }) => {
  return (
    <select onChange={(e) => onUserChange(e.target.value)} defaultValue="">
      <option value="" disabled>Select User</option>
      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.username}
        </option>
      ))}
    </select>
  );
};

export default UserSelector;
