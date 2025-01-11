import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import { userChats } from '../api/ChatRequest'
import { useSelector } from 'react-redux';
import Conversation from '../components/Conversation'
import ChatBox from '../components/ChatBox'
import {io} from "socket.io-client"
import { createChat } from '../api/ChatRequest';
import { getAllUsers } from '../api/AllUsersRequest';

const Chat = ({currentUser}) => {
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState([]); // State to store users
    const [showUserList, setShowUserList] = useState(false); // Toggle user list
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [sendMessage, setSendMessage] = useState(null)
    const [receiveMessage, setReceiveMessage] = useState(null)

    // Using redux store
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const user = selectedUser?._id; 
    console.log("Redux user", user);

    // Current UserId
    //const user = "5f47a0d2c9b6c53d0f2d1b4d"
        if (!currentUser) {
          return <div>Please select a user to chat with.</div>;
        }

    console.log("Current User", currentUser)

    

    const socket = useRef()

    // Sending Message to Socket Server
    useEffect(() => {
        if(sendMessage !== null){
            socket.current.emit('send-message', sendMessage)
        }
    }, [sendMessage])

    useEffect(() => {
        socket.current = io('http://localhost:8800')
        // To subscribe(register) for the server
        socket.current.emit("new-user-add", user)
        // To catch the emitted User from the socket.io server
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users)
            console.log("Online Users", onlineUsers)
        })
    }, [user])

    // Receiving Message from Socket Server
    useEffect(() => {
        socket.current.on('receive-message', (data) => {
            setReceiveMessage(data)
        })
    }, [])
    
    useEffect(() => {
        const getChats = async() => {
            try {
                const {data} = await userChats(user)
                setChats(data)
                console.log("Chats", data)
            } catch (error) {
                console.log(error)
            }
        }

        getChats()
    }, [user])

     // Fetch all users to display in the user list
     useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                console.log('API Response:', response.data); // Check the response data
                setUsers(response.data.filter((user) => user._id !== currentUser._id));
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };
        fetchUsers();
        console.log("All Users: ",users)
    }, []);

    // Checking the online status
    const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user)
    const online = onlineUsers.find((eachUser) => eachUser.userId === chatMember)
    return online ? true : false
    }

    // Create a new chat
    const handleUserClick = async (selectedUser) => {
        // Check if the current user and selected user are valid
        if (!user || !selectedUser._id) {
          console.log('Invalid user or selectedUser ID');
          return;
        }
      
        const existingChat = chats.find(
          (chat) => chat.members.includes(user) && chat.members.includes(selectedUser._id)
        );
      
        if (existingChat) {
          setCurrentChat(existingChat);
        } else {
          try {
            // Pass userId and selectedUser._id to the createChat function
            console.log("Current user id while creating", user)
            console.log("ReceiverId user id while creating", selectedUser._id)
            const { data } = await createChat(user, selectedUser._id);
            console.log('Chat created:', data); // Log chat data to verify
            setChats([data, ...chats]);
            setCurrentChat(data);
          } catch (error) {
            console.log('Error creating chat:', error);
          }
        }
      };
      
    
  return (
    <div className="Chat">
        {/* Left side */}
        <div className="Left-side-chat">
            <div className="Chat-container">
                <h2>Chats
                <button
              className="ml-2 p-2 bg-blue-500 text-white rounded-full"
              onClick={() => setShowUserList(!showUserList)}
            >
              +
            </button>

                </h2>
                {showUserList && (
                        <div className="UserList absolute bg-white shadow-lg rounded-lg w-60 p-4 mt-2">
                            <h3 className="text-lg font-semibold">Users:</h3>
                            <ul className="space-y-2">
                                {users.map((i) => (
                                <li
                                    key={i._id}
                                    onClick={() => handleUserClick(i)}
                                    className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                                >
                                    {i.username}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                <div className="Chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                            <Conversation 
                            data={chat} 
                            currentUserId={user}
                            online = {checkOnlineStatus(chat)}
                            />
                        </div>
                    ))}
                </div>
            </div>
           
        </div>
        {/* Right side */}
        <div className="Right-side-chat">
            <div style={{width: "20rem", alignSelf: "flex-end"}}>
            {/* Chat Body */}
            <ChatBox 
            chat={currentChat} 
            currentUser={user} 
            setSendMessage={setSendMessage}
            receiveMessage = {receiveMessage}
            />
            </div>
        </div>
    </div>
  )
}

export default Chat