import React, { useEffect, useState } from 'react'
import { getUser } from '../api/UserRequest'

const Conversation = ({data, currentUserId, online}) => {
    //This is the user(client) whom we are chatting to
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        // Getting userid of other person or users(clients)
        const userId = data.members.find((id) => id!==currentUserId)
        console.log("Clients Id: ", userId)
        const getUserData = async() => {
            try {
              const {data} = await  getUser(userId)
              setUserData(data)
              console.log("User Data: ",data)
            } catch (error) {
              console.log(error)
            }
        }
        getUserData();
    }, [])
  return (
    <>
    <div className="follower conversation">
      {online && <div className="online-dot"></div>}
      <img src="dp.png" alt="" className='followerImage' 
      style={{width:'50px', height:'50px'}}/>
      <div className="name" style={{fontSize:'0.8rem'}}>
        <span>{userData?.username}</span>
        <span>{online ? "Online" : "Offline"}</span>
      </div> 
    </div>
    <hr style={{width:'85%', border:'0.1px solid rgb(213, 208, 208)'}}/>
    </>
  )
}

export default Conversation