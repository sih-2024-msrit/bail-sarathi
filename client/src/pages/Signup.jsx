import React, { useEffect, useState } from 'react'
import { apiConnector } from '../services/apiConnector';
import {authEndpoints} from "../services/api"
import toast from "react-hot-toast"
const {SIGNUP_API}=authEndpoints;

const Signup = () => {
  const [data,setData]=useState({
    name:"",
    email:"",
    password:"",
    gender:"male",
    accountType:"",
    location:"",
  });

  const handleChange=(e)=>{
    if(e.target.type==='radio'){
      setData((prev)=>({
        ...prev,
        "accountType":e.target.id
      }))
    }
    else{
    setData((prev)=>{
      return ({
        ...prev,
        [e.target.id]:e.target.value
      })
    })
  }
  }

  const signup=async(data)=>{
    const toastId=toast.loading("loading.....")
    try{
      const response=await apiConnector("POST",SIGNUP_API,data);
      if(!response?.data?.success){
        throw new Error("NHI CHALA")
      }
      console.log("RESPONSE DATA",response?.data)
      toast.success("JEET GYE ")
    }
    catch(err){
      console.log(err);
      toast.error("FAT GYA")
    }
    toast.dismiss(toastId)
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    signup(data);
  }
  return (
    <div className='w-screen text-black text-center flex gap-5 flex-col justify-center '>
        <h1 className='text-3xl  text-black font-bold'>Signup</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 px-16'>
        <label htmlFor="name">Name</label>
        <input onChange={handleChange} type="text" id='name'  className='border border-black rounded-md '/>
        {/* <label htmlFor="license">License</label>
        <input onChange={handleChange} type="text" id='license'/> */}
        <label htmlFor="email">Email</label>
        <input onChange={handleChange} type="email" id='email' className='border border-black rounded-md '/>
        <label htmlFor="password" >Password</label>
        <input onChange={handleChange} type="password" id='password' className='border border-black rounded-md '/>
        <label htmlFor="gender">Gender</label>
        <select onChange={handleChange} className='border border-black rounded-md' name="gender" id="gender">
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>
        <p>Account Type:</p>
        <span>
        <input onChange={handleChange} type="radio" name="accountType" id="lawyer" />
        <label htmlFor="lawyer">lawyer</label>  
        </span>
     
        <span>
        <input onChange={handleChange}  type="radio" name="accountType" id="judge" />
        <label htmlFor="judge">judge</label> 
        </span>

        <label htmlFor="location">Location</label>
        <input onChange={handleChange}  className='rounded-md border border-black'type="text" id='location' />

        <button className="border border-black rounded-md hover:cursor-pointer hover:bg-black hover:text-white" type='submit'>Submit</button>
        </form>

    </div>
  )
}

export default Signup