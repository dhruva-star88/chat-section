import React, { useState, useEffect } from 'react';
import Chat from './Chat/Chat';
import { getAllUsers } from './api/AllUsersRequest';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  return (
    <div>
      <h2>Select User</h2>
      <select onChange={handleUserChange} value={selectedUser || ''}>
        <option value="" disabled>Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>

      {selectedUser && <Chat currentUser={selectedUser} />}
    </div>
  );
};

export default App;
