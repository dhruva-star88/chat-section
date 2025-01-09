import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import { userChats } from '../api/ChatRequest'
import { useSelector } from 'react-redux';
import Conversation from '../components/Conversation'
import ChatBox from '../components/ChatBox'
import {io} from "socket.io-client"
// import { Link } from 'react-router-dom';
// import { UilSetting } from '@iconscout/react-unicons';
// import Home from "../assets/img/home.png";
// import Noti from "../assets/img/noti.png";

const Chat = ({currentUser}) => {
    const [chats, setChats] = useState([])
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

    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [sendMessage, setSendMessage] = useState(null)
    const [receiveMessage, setReceiveMessage] = useState(null)

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
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }

        getChats()
    }, [user])

    // Checking the online status
    const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user)
    const online = onlineUsers.find((eachUser) => eachUser.userId === chatMember)
    return online ? true : false
    }
  return (
    <div className="Chat">
        {/* Left side */}
        <div className="Left-side-chat">
            <div className="Chat-container">
                <h2>Chats</h2>
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