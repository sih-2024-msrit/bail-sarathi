import React,{ useEffect, useState }from 'react'
import { apiConnector } from '../services/apiConnector';
import { authEndpoints } from '../services/api';
import toast from 'react-hot-toast';
import {useDispatch} from "react-redux"
import { setToken } from '../slices/authSlice';
import { setUser } from '../slices/userSlice';

const {LOGIN_API} =authEndpoints;
const Login = () => {
   const dispatch=useDispatch();
   const [data,setData]=useState({
    license:"",
    password:""
    });
    
  const handleChange=(e)=>{
    setData((prev)=>({...prev,
        [e.target.name]:e.target.value
    }))
  }

  const login=async(data)=>{
    const toastId=toast.loading("loading.....")
    try{
      const response=await apiConnector("POST",LOGIN_API,data);
      if(!response?.data?.success){
        throw new Error("NHI CHALA")
      }
      console.log("RESPONSE DATA",response?.data)
      setToken(response?.data?.token)
      setUser(response?.data?.user)
      toast.success("JEET GYE ")
    }
    catch(err){
      console.log(err);
      toast.error("FAT GYA")
    }
    toast.dismiss(toastId)
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    login(data)
  }
  return (
    <div className='w-screen text-black text-center flex gap-5 flex-col justify-center '>
        <h1 className='text-3xl  text-black font-bold'>Login</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 px-16'>
        <label htmlFor="license">License:</label>
        <input onChange={handleChange} type="text" name='license' id='license' className='border border-black rounded-md'/>
        <label htmlFor="password">Password:</label>
        <input onChange={handleChange} type="password" name="password" id="password" className='border border-black rounded-md' />
        <button className="border border-black rounded-md hover:cursor-pointer hover:bg-black hover:text-white" type='submit'>Submit</button>
        </form>

    </div>
  )
}

export default Login