import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { bailoutEndpoints } from '../services/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


const {BAIL_APPLY_API}=bailoutEndpoints;
const BailApply = () => {
  const [data,setData]=useState({
    applicationNo:"",
    jurisdiction:"",
    caseDetails:null,
    application:null,
  })
  const handleChange=(e)=>{
    if(e.target.type==='file'){
        setData((prev)=>({
            ...prev,
            [e.target.name]:e.target.files[0]
        }))
    }
    else{
        setData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }


  };
  console.log("object in body:",data);
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const toastId=toast.loading("loading....")
    console.log("DATA FOR API:",data);
    //api call here
    try{
        const response=await apiConnector("POST",BAIL_APPLY_API,data,{
            'Content-Type': 'multipart/form-data'
        });
        if(!response?.data?.success){
            throw new Error("Some error in making bail")
        }

        console.log("Application for bail:",response?.data?.bailApply);
    }
    catch(err){
        console.log("error while making bail application",err);
        toast.error("couldnt make bail")
    }
    toast.dismiss(toastId)
  };
  return (
    <div>
        <Navbar/>
        <div className='px-16'>
            <p className='text-3xl'>Enter your case details</p>
            <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
            <div className='flex flex-row gap-12 mt-12'>
                <div className='bg-white w-[300px] rounded-md py-2 px-4'>
                    <label htmlFor="applicationNo" className='border-none text-xs text-gray-500 flex flex-col text-grey bg-transparent'>Application Number:</label>
                    <input onChange={handleChange} className="relative w-max border-none focus:outline-none bg-transparent rounded-md" type="text" id='applicationNo' name='applicationNo' />
                </div>
                <div className='bg-white w-[300px] rounded-md py-2 px-4'>
                    <label htmlFor="jurisdiction" className='border-none text-xs text-gray-500 flex flex-col text-grey bg-transparent'>Jurisdiction:</label>
                    <input onChange={handleChange} className="border-none focus:outline-none  bg-transparent rounded-md" type="text" id='jurisdiction' name='jurisdiction' />
                </div>
                </div>

                <div className='max-w-2xl'>
                    <label htmlFor="caseDetails" class="border-none text-xs text-gray-500 flex flex-col bg-transparent">Upload CaseDetails:</label>
                    <input  onChange={handleChange} type="file"         name="caseDetails" id="caseDetails" 
                        class="w-full text-gray-400 mt-2 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                    <p class="text-xs text-gray-400 mt-2">PDF is Allowed.</p>
                </div>
           
                <div className="max-w-2xl">
                    <label class="border-none text-xs text-gray-500 flex flex-col bg-transparent">Upload file</label>
                    <input  onChange={handleChange} type="file"         name="application" id="application" 
                        class="w-full text-gray-400 mt-2 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                    <p class="text-xs text-gray-400 mt-2">PDF is Allowed.</p>
                </div>

                <button className="hover:cursor-pointer bg-[#1E2E45] text-white py-2 px-5 w-max hover:bg-[#33527e]" type='submit'>Submit</button>
        </form>
        </div>
        <Footer/>
    </div>
  )
}

export default BailApply