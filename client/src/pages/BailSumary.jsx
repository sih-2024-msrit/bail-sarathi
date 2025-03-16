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

const { STATUS_CHANGE } = bailoutEndpoints;

const BailSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicationNo } = useParams();

  const topics = ['Bail Summary', 'Previous Cases', 'IPC Section', 'Criminal Record'];
  const [topic, setTopic] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchBailSummary = async () => {
      setLoading(true);
      try {
        const formData = { applicationNo }; 
        const response = await dispatch(bailSummary(formData));
        setData(response)
        console.log("DATA:", response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    if (applicationNo) {
      fetchBailSummary();
    }
  }, [dispatch, applicationNo]);

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

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 text-black p-4'>
        
        {/* case details */}
        <div className='w-[90%] md:w[80%] dm-serif-displays lg:w-[70%] grid md:grid-cols-2 lg:grid-cols-4 h-fit border border-black mb-3 p-4 mx-auto'>
          {/* <div className="flex flex-col md:flex-row gap-x-10"> */}
            <div className=''> <span className='font-semibold'>Application</span> : {data?.applicationNo} </div>
            <div className=''> <span className='font-semibold'>Date </span> : {data?.createdAt?.substr(0,10) + " " +  data?.createdAt?.substr(11,5)} </div>
            <div className=''> <span className='font-semibold'>Jurisdiction </span> : {data?.jurisdiction?.charAt(0).toUpperCase() + data?.jurisdiction?.slice(1)} </div>
            <div className=''> <span className='font-semibold'>Status </span> : {data?.status?.charAt(0)?.toUpperCase() + data?.status?.slice(1)} </div>
        </div>


        {/* summary */}
        <div className='gap-y-5 w-[90%] dm-serif-display md:w[80%] lg:w-[70%]  h-fit border border-black p-4 mx-auto'>
          <div className='flex flex-row gap-4 justify-items-start mb-4'>
            {topics?.map((top, index) => (
              <button
                key={index}
                onClick={() => setTopic(index)}
                className={`border-0 pb-1 font-semibold dm-serif-display ${topic === index ? 'text-black border-b-2 border-black' : 'text-[#808080]'}`}
              >
                {top}
              </button>
            ))}
          </div>
          <div className='text-lg mt-4'>

            {loading ? ("Generating...") : (
              topic === 0 ? (
                <ReactMarkdown>{data?.bailSummary?.toString()}</ReactMarkdown>
              ) : topic === 1 ? (
                <ReactMarkdown>{data?.previousCase?.toString()}</ReactMarkdown>
              ) : topic === 2 ? (
                <ReactMarkdown>{data?.ipcSection?.toString()}</ReactMarkdown>
              ) : (
                <ReactMarkdown>{data?.criminalCase?.toString()}</ReactMarkdown>
              )
            )}
          </div>
        </div>
      </div>

      <div className=' w-[90%] md:w[80%] lg:w-[70%]  mx-auto'>
        <form className='flex flex-row justify-between w-full gap-4'>
          <div className='flex justify-between'>
            <button type="button" onClick={() => navigate(-1)} className='dm-serif-display bg-gray-500 text-white p-2 w-[100px] h-[45px]'>Back</button>
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
