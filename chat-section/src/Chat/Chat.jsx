import React, { useEffect, useState } from 'react'
import "./chat.css"
import { userChats } from '../api/ChatRequest'
import Conversation from '../components/Conversation'
import { Link } from 'react-router-dom';


const Chat = () => {
    const [chats, setChats] = useState([])

    const user = "5f47a0d2c9b6c53d0f2d1b4d"

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
  return (
    <div className="Chat">
        {/* Left side */}
        <div className="Left-side-chat">
            <div className="Chat-container">
                <h2>Chats</h2>
                <div className="Chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id}>
                            <Conversation data={chat} currentUserId={user} />
                        </div>
                    ))}
                </div>
            </div>
           
        </div>
        {/* Right side */}
        <div className="Right-side-chat">
            <div style={{}}>
            
            </div>
        </div>
    </div>
  )
}

export default Chat