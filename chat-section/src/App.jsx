import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from './store/userSlice';  // Import the action
import { getAllUsers } from './api/AllUsersRequest';
import UserSelector from './components/UserSelector';
import Chat from './Chat/Chat';

const App = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);  // Accessing selected user from store

  const [users, setUsers] = useState([]);

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
    console.log("All users from APP", users)
  }, []);

  const handleUserChange = (userId) => {
    const user = users.find((u) => u._id === userId);  // Find the user object by ID
    console.log("user", user)
    if (user) {
      dispatch(setSelectedUser(user));  // Dispatch the user object to the store
      console.log("Selected user", selectedUser)
    }
  };

  return (
    <div>
      <h2>Select User</h2>
      {!selectedUser && (
        <UserSelector users={users} onUserChange={handleUserChange} />
      )}
      {selectedUser && <Chat currentUser={selectedUser} />}
    </div>
  );
};

export default App;
