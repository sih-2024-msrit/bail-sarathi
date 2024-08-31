import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bailSummary } from '../services/operations/bailAPI';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const BailSummary = () => {
  const dispatch = useDispatch();
  const topics = ['Bail Summary', 'Previous Cases', 'IPC Section', 'Criminal Record'];
  const shortform = ['bs', 'pc', 'is', 'cr'];
  const [topic, setTopic] = useState(0);
  const { applicationNumber } = useParams();

  useEffect(() => {
    const fetchBailSummary = async () => {
      try {
        const formData = { shortform: 'bs', applicationNumber };
        const response = await dispatch(bailSummary(formData));
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchBailSummary();
  }, [dispatch, applicationNumber]);

  const [data, setData] = useState({
    bailSummary: "",
    previousCases: "",
    ipcSection: "",
    criminalRecord: ""
  });

  const descriptions = [
    data.bailSummary,
    data.previousCases,
    data.ipcSection,
    data.criminalRecord
  ];

  const handleGenerate = async (index) => {
    if (!descriptions[index]) {
      try {
        const formData = { flag: shortform[index], applicationNo: applicationNumber };
        const response = await dispatch(bailSummary(formData));
        setData(prevData => ({
          ...prevData,
          ...response
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    setTopic(index);
    console.log('Generate button clicked for topic:', topics[index]);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 text-black p-4'>
        <div className='gap-y-5 w-[60%] h-[400px] border border-black p-4 mx-auto'>
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
            {descriptions[topic]}
          </div>
        </div>
      </div>
      <div className='p-4 flex justify-center'></div>
      <Footer />
    </div>
  );
};

export default BailSummary;
