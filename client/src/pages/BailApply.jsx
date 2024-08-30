import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { bailoutEndpoints } from '../services/api';
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
    <div className='bg-white px-16 '>
        <h1>Apply For bail</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
            <label htmlFor="applicationNo">Application Number:</label>
            <input onChange={handleChange} className="border border-black rounded-md" type="text" id='applicationNo' name='applicationNo' />

            <label htmlFor="jurisdiction">Jurisdiction:</label>
            <input onChange={handleChange} className="border border-black rounded-md" type="text" id='jurisdiction' name='jurisdiction' />

            <label htmlFor="caseDetails">Upload CaseDetails:</label>
            <input onChange={handleChange} type="file" name="caseDetails" id="caseDetails" />

            <label htmlFor="application">Upload Application:</label>
            <input onChange={handleChange} type="file" name="application" id="application" />

            <button type='submit' className='border border-black rounded-md hover:cursor-pointer hover:text-white hover:bg-black'>
                Submit
            </button>
        </form>
    </div>
  )
}

export default BailApply