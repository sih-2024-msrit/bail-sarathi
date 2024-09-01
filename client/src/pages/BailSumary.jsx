import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bailSummary } from '../services/operations/bailAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactMarkdown from "react-markdown";
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { bailoutEndpoints } from "../services/api";
import pcdata from './pc.json'


const { STATUS_CHANGE } = bailoutEndpoints;

const BailSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicationNo } = useParams();

  const topics = ['Bail Summary', 'Previous Cases', 'IPC Section', 'Criminal Record'];
  const newTopics = ['bailSummary', 'previousCases', 'ipcSection', 'criminalRecord'];
  const shortform = ['bs', 'pc', 'is', 'cr'];
  const [topic, setTopic] = useState(0);

  const [data, setData] = useState({
    bailSummary: "",
    previousCases: "",
    ipcSection: null,
    criminalRecord: null
  });

  useEffect(() => {
    const fetchBailSummary = async () => {
      try {
        const formData = { flag: 'bs', applicationNo }; 
        const response = await dispatch(bailSummary(formData));
        console.log("RESPONSE:", response);
        setData(prevData => ({
          ...prevData,
          bailSummary: response
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (applicationNo) {
      fetchBailSummary();
    }
  }, [dispatch, applicationNo]);

  console.log("RESPONSE IN BODY:", data);

  const changeStatus = async (status) => {
    const formData = { status, applicationNo };
    try {
      const response = await apiConnector("POST", STATUS_CHANGE, formData);
      console.log("RESPONSE:", response);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

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
        if (shortform[index] === 'cr') {
          setData(prevData => ({
            ...prevData,
            'criminalRecord': response
          }));
        } else {
          setData(prevData => ({
            ...prevData,
            [newTopics[index]]: response
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
                className={`border-0 pb-1 dm-serif-display ${topic === index ? 'text-black border-b-2 border-black' : 'text-[#808080]'}`}
              >
                {top}
              </button>
            ))}
          </div>
          <div className='text-lg mt-4'>
            {
              (topic === 2) ? (
                descriptions[topic] === null ? ("Generating...") : (Object.entries(descriptions[topic]).map(([key, value], index) => (
                  <li key={index}>
                    {key}: {value.join(", ")}
                  </li>
                )))
              ) : (
                topic === 3 ?
                  (
                    descriptions[topic] === null ? ("Generating...") : (() => {
                      try {
                        return JSON.parse(descriptions[topic])?.map((item, index) => (
                          <li key={index}>{item?.toString()}</li>
                        ));
                      } catch {
                        return <li>Invalid data format</li>;
                      }
                    })()
                  )
                  : topic === 0 ?
                  (<ReactMarkdown>{descriptions[topic]?.toString().length === 0 ? ("Generating...") : (descriptions[topic]?.toString())}</ReactMarkdown>)
                  :
                  pcdata?.map((item, index) => (
                    <li key={index}>
                      <p><strong>URL:</strong> <a className='text-blue-600 underline hover:cursor-pointer' target='_blank' href={item.url}>url link</a></p>
                      <p><strong>Content:</strong> <ReactMarkdown>{item.content}</ReactMarkdown> </p>
                      <p><strong>Page Number:</strong> {item.page_no}</p>
                    </li>
                  ))
                  
                  
              )
            }
          </div>
        </div>
      </div>

      <div className='w-[60%] mx-auto'>
        <form className='flex flex-row justify-between w-full gap-4'>
          <div className='flex justify-between'>
            <button type="button" onClick={() => navigate(-1)} className='dm-serif-display bg-gray-300 text-white p-2 w-[100px] h-[45px]'>Back</button>
          </div>
          <div className='flex flex-row gap-10'>
              <button type="button" onClick={() => changeStatus('Accepted')} className='dm-serif-display bg-green-500 text-white p-2 w-[100px] h-[45px]'>Accept</button>
            <button type="button" onClick={() => changeStatus('Rejected')} className='dm-serif-display bg-red-500 text-white p-2 w-[100px] h-[45px]'>Reject</button>
          </div>
        </form>
      </div>
      <div className='p-4 flex justify-center'></div>
      <Footer />
    </div>
  );
};

export default BailSummary;
