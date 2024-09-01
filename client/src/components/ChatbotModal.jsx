import React, { useEffect, useState } from 'react'

const ChatbotModal = () => {
    const [userMessages,setUserMessages]=useState([])
    const [chatMessages,setChatMessages]=useState([]);
    const [isVisible,setIsVisible]=useState(false);

    useEffect(()=>{},[]);
  
  
    return (
        <>
      <div onClick={()=>setIsVisible(!isVisible)} className='absolute flex items-center justify-center w-20 h-20 rounded-full bg-white bottom-5 right-5'>
        <img src="" alt="" />
      </div>

      <div className='absolute  bottom-5 right-5'>


      </div>
      </>
    )
}

export default ChatbotModal


