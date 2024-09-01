import React, { useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { bailoutEndpoints } from '../services/api';
import { apiConnector } from '../services/apiConnector';
import ReactMarkdown from 'react-markdown';
import chatlogo from "../assets/chatbotlogo.png"
import { IoSend } from "react-icons/io5";
const { TEST_CHATBOT_API } = bailoutEndpoints;

const ChatbotModal = () => {
  const [userMessages, setUserMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading

  const fetchData = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await apiConnector("POST", TEST_CHATBOT_API, {
        question: data
      });
      if (!response?.data?.success) {
        throw new Error("Couldn't get a reply for the question raised");
      }
      const newResponse = response?.data?.response;
      setChatMessages((prev) => ([
        ...prev,
        newResponse
      ]));

      if(data==='bye' || data==='exit' || data==='quit'){
        setTimeout(()=>{setIsVisible(false)},2000)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // End loading
    }
  };

  console.log("DATA:", userMessages);
  console.log("BOT:", chatMessages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserMessages((prev) => ([
      ...prev,
      data
    ]));
    const sd=data;
    setData("");
    await fetchData(sd);
  
  };

  console.log("Message rn:", data);

  const handleChange = (e) => {
    setData(e?.target?.value);
  };

  return (
    <>
      {/* Button to toggle modal visibility */}
      <div
        onClick={() => setIsVisible(!isVisible)}
        className={`absolute hover:cursor-pointer items-center ${isVisible ? "hidden" : "flex"} justify-center w-20 h-20 rounded-full bg-white bottom-5 right-5`}
      >
        <img src={chatlogo} height={40} width={40} alt="" />
      </div>

      {/* Chatbot modal */}
      <div className={`absolute ${isVisible ? "flex flex-col" : "hidden"} bottom-5 h-[500px] w-[380px] grid grid-rows-[auto_1fr_auto] bg-white right-5 rounded-lg shadow-lg`}>

        {/* Close icon */}
        <div className='w-full p-2 place-item-end text-right'>
          <IoCloseSharp
            onClick={() => setIsVisible(!isVisible)}
            className='hover:cursor-pointer'
            size={28}
          />
        </div>

        {/* Messages container */}
        <div className='overflow-y-auto p-4 border-t border-b border-green-500'>
          {/* Render user and chatbot messages */}
          {userMessages.map((message, index) => (
            <div key={index} className="mb-2">
              {/* User message */}
              <div className="bg-blue-200 text-left p-2 rounded mb-1">
                {message}
              </div>
              {/* Chatbot message */}
              {chatMessages[index] ? (
                <div className="bg-gray-200 text-left p-2 rounded mb-1">
                  <ReactMarkdown>{chatMessages[index]}</ReactMarkdown>
                </div>
              ) : loading && index === userMessages.length - 1 ? (
                <div className="bg-gray-200 text-left p-2 rounded mb-1 italic">
                  Generating...
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Input field */}
        <form onSubmit={handleSubmit} className='w-full relative p-2 border-t border-black'>
          <input
            onChange={handleChange}
            value={data}
            type="text"
            placeholder='Enter your message here...'
            className='w-full p-2 border border-gray-300 rounded'

          />
          <button type='submit' className='absolute right-5 top-5 hover:cursor-pointer'>
          <IoSend   size={20}  />
          </button>
            
        </form>

      </div>
    </>
  );
};

export default ChatbotModal;
