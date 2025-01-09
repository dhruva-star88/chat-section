import React, { useEffect, useState } from 'react';
import { getUser } from '../api/UserRequest';
import './chatbox.css';
import { addMessage, getMessages } from '../api/MessageRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (receiveMessage !== null && receiveMessage.chatId === chat?._id) {
            console.log("Chat ID",chat._id);
            console.log("Data received in ChatBox", receiveMessage);
            setMessages((prevMessages) => [...prevMessages, receiveMessage]);
        }
    }, [receiveMessage, chat]);

    // Fetching Data for the header of our ChatBox
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser);
        console.log("Client's Id: ", userId);

        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
                console.log("User Data: ", data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat) getUserData();
    }, [chat, currentUser]);

    // Fetching data for messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                console.log("Message Data", data);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat) fetchMessages();
    }, [chat]);

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id
        };

        // Sending Message to the Database
        try {
            const { data } = await addMessage(message);
            setMessages((prevMessages) => [...prevMessages, data]);
            setNewMessage("");
        } catch (error) {
            console.log(error);
        }

        // Send Message to socket server
        const receiverId = chat.members.find((id) => id !== currentUser);
        setSendMessage({ ...message, receiverId });
    };

    return (
        <div className="ChatBox-container">
            {chat ? (
                <>
                    <div className="chat-header">
                        <div className="follower">
                            <img src="dp.png" alt="" className="followerImage" style={{ width: '50px', height: '50px' }} />
                            <div className="name" style={{ fontSize: '0.8rem' }}>
                                <span>{userData?.username}</span>
                            </div>
                        </div>
                        <hr style={{ width: '85%', border: '0.1px solid rgb(213, 208, 208)' }} />
                    </div>
                    <div className="chat-body">
                        {messages.map((message) => (
                            <div key={message._id} className={message.senderId === currentUser ? "message own" : "message"}>
                                <span>{message.text}</span>
                                <span>{format(message.createdAt)}</span>
                            </div>
                        ))}
                        <div className="chat-sender">
                            <div>+</div>
                            <InputEmoji value={newMessage} onChange={handleChange} />
                            <div className="send-button button" onClick={handleSend}>Send</div>
                        </div>
                    </div>
                </>
            ) : (
                <span className="chatbox-empty-message">
                    Tap On a Chat to Start Conversation...
                </span>
            )}
        </div>
    );
};

export default ChatBox;
