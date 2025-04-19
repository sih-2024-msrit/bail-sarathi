import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bailSummary } from '../services/operations/bailAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from "react-markdown";
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { bailoutEndpoints } from "../services/api";
import { clearSummaryDetails } from '../slices/summarySlice';

const { STATUS_CHANGE } = bailoutEndpoints;

const BailSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicationNo } = useParams();

  const { details, loading, error } = useSelector((state) => state.summary);

  const topics = ['Bail Summary', 'Previous Cases', 'IPC Section', 'Criminal Record'];
  const [topic, setTopic] = useState(0);

  useEffect(() => {
    const fetchBailSummary = () => {
      if (applicationNo) {
        const formData = { applicationNo };
        dispatch(bailSummary(formData));
      }
    };
    
    fetchBailSummary();

    return () => {
      dispatch(clearSummaryDetails());
    };

  }, [dispatch, applicationNo]);

  const changeStatus = async (status) => {
    const formData = { status, applicationNo };
    const toastId = toast.loading("Updating Status...")
    try {
      const response = await apiConnector("POST", STATUS_CHANGE, formData);
      console.log("RESPONSE:", response);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Failed to update status');
      }

      toast.success('Status updated successfully');
      dispatch(bailSummary({ applicationNo }));

    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error?.response?.data?.message || 'Error updating status');
    } finally {
        toast.dismiss(toastId);
    }
  };

  if (error) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <div className='flex-1 text-red-500 p-4 text-center'>Error: {error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 text-black p-4'>
        
        <div className='w-[90%] md:w[80%] dm-serif-displays lg:w-[70%] grid md:grid-cols-2 lg:grid-cols-4 h-fit border border-black mb-3 p-4 mx-auto'>
            <div className=''> <span className='font-semibold'>Application</span> : {details?.applicationNo || '...'} </div>
            <div className=''> <span className='font-semibold'>Date </span> : 
              {details?.createdAt 
                ? new Date(details.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(details.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                : 'N/A'
              }
            </div>
            <div className=''> <span className='font-semibold'>Jurisdiction </span> : {details?.jurisdiction?.charAt(0).toUpperCase() + details?.jurisdiction?.slice(1) || '...'} </div>
            <div className=''> <span className='font-semibold'>Status </span> : {details?.status?.charAt(0)?.toUpperCase() + details?.status?.slice(1) || '...'} </div>
        </div>

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
          <div className='text-lg mt-4 min-h-[100px]'>
            {loading ? ("Generating...") : (
              topic === 0 ? (
                <ReactMarkdown>{details?.bailSummary || "No summary available."}</ReactMarkdown>
              ) : topic === 1 ? (
                <ReactMarkdown>{details?.previousCase || "No previous cases found."}</ReactMarkdown>
              ) : topic === 2 ? (
                <ReactMarkdown>{details?.ipcSection || "No IPC sections found."}</ReactMarkdown>
              ) : (
                <ReactMarkdown>{details?.criminalCase || "No criminal record found."}</ReactMarkdown>
              )
            )}
          </div>
        </div>
      </div>

      <div className=' w-[90%] md:w[80%] lg:w-[70%]  mx-auto my-4'>
        <form className='flex flex-row justify-between w-full gap-4'>
          <div className='flex justify-between'>
            <button type="button" onClick={() => navigate(-1)} className='dm-serif-display bg-gray-500 text-white p-2 w-[100px] h-[45px]'>Back</button>
          </div>
          {details?.status?.toLowerCase() === 'pending' && (
            <div className='flex flex-row gap-10'>
              <button type="button" onClick={() => changeStatus('Accepted')} className='dm-serif-display bg-green-500 text-white p-2 w-[100px] h-[45px]'>Accept</button>
              <button type="button" onClick={() => changeStatus('Rejected')} className='dm-serif-display bg-red-500 text-white p-2 w-[100px] h-[45px]'>Reject</button>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BailSummary;
