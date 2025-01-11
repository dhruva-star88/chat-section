import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/AllUsersRequest';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../store/userSlice'; // Redux action to set selected user

const UserList = () => {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        dispatch(setSelectedUser(user)); // Dispatch action to update Redux store
    };

    return (
        <div className="UserList">
            <h2>Select a User</h2>
            {users.map((user) => (
                <div key={user._id} onClick={() => handleUserClick(user)}>
                    {user.username} {/* Assuming user object has a `name` field */}
                </div>
            ))}
        </div>
    );
};

export default UserList;
