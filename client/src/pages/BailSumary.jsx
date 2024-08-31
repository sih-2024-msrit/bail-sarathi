import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bailSummary } from '../services/operations/bailAPI';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactMarkdown from "react-markdown";
import toast from 'react-hot-toast';

const BailSummary = () => {
  const dispatch = useDispatch();
  const topics = ['Bail Summary', 'Previous Cases', 'IPC Section', 'Criminal Record'];
  const newTopics=[   
    'bailSummary',
    'previousCases',
    'ipcSection',
    ,'criminalRecord'];
  const shortform = ['bs', 'pc', 'is', 'cr'];
  const [topic, setTopic] = useState(0);
  const { applicationNo } = useParams();
  const [data, setData] = useState({
    bailSummary: "",
    previousCases: "",
    ipcSection:  null,
    criminalRecord: null
  });


  useEffect(() => {
    const fetchBailSummary = async () => {
      try {
        const formData = { flag: 'bs', applicationNo };
        const response = await dispatch(bailSummary(formData));
        console.log("RESPONSE:",response);
        setData(prevData => ({
          ...prevData,
          bailSummary:response
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchBailSummary();
  }, []);

  console.log("RESPONSE IN BODY:",data);



  const descriptions = [
    data.bailSummary,
    data.previousCases,
    data.ipcSection,
    data.criminalRecord
  ];

  const handleGenerate = async (index) => {
    setTopic(index);
    if (!descriptions[index]) {
      try {
        const formData = { flag: shortform[index], applicationNo: applicationNo };
        const response = await dispatch(bailSummary(formData));
        if(shortform[index]==='cr'){
          setData(prevData => ({
            ...prevData,
            'criminalRecord':response
          }));
        }
        else{
        setData(prevData => ({
          ...prevData,
          [newTopics[index]]:response
        }));
      }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    console.log('Generate button clicked for topic:', topics[index]);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 text-black p-4'>
        <div className='gap-y-5 w-[60%] h-fit border border-black p-4 mx-auto'>
          <div className='flex flex-row gap-4 justify-items-start mb-4'>
            {topics.map((top, index) => (
              <button
                key={index}
                onClick={() => handleGenerate(index)}
                className={`border-0 pb-1 ${topic === index ? 'text-black border-b-2 border-black' : 'text-[#808080]'}`}
              >
                {top}
              </button>
            ))}
          </div>
          <div className='text-lg mt-4'>            
            {
              (topic===2)?(
                descriptions[topic]===null?("generating..."):(Object.entries(descriptions[topic]).map(([key,value],index)=>(
                  <li>
                    {key}:{value.join(", ")}
                  </li>
                )))
              ):(
                topic==3?
                (
                  descriptions[topic]===null?("generating..."):(JSON.parse(descriptions[topic])?.map((item)=>(
                    <li>{item?.toString()}</li>
                  )))
                )
                
                :(<ReactMarkdown>{descriptions[topic]?.toString().length===0?("Generating...."):(descriptions[topic]?.toString())}</ReactMarkdown>)
    
              
              )
            }
          </div>
        </div>
      </div>
      <div className='p-4 flex justify-center'></div>
      <Footer />
    </div>
  );
};

export default BailSummary;
