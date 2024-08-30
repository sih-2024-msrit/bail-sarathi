import React,{ useEffect, useState }from 'react'
import { apiConnector } from '../services/apiConnector';
import { authEndpoints } from '../services/api';
import toast from 'react-hot-toast';
import {useDispatch} from "react-redux"
import { setToken } from '../slices/authSlice';
import { setUser } from '../slices/userSlice';
import image from '../assets/bail_woman.PNG'
import { IoEyeOffSharp ,IoEyeSharp } from "react-icons/io5";

const {LOGIN_API} =authEndpoints;
const Login = () => {
   const dispatch=useDispatch();
   const [data,setData]=useState({
    license:"",
    password:""
    });

    const [showPassword, setShowPassword] = useState(false)
    
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
    <div className='w-screen bg-slategray flex-row justify-between text-black flex gap-5 '>
      <div className='my-auto flex flex-col gap-y-10 place-items-center mx-auto'>
       
          <div className='flex flex-row place-items-center mb-6 mx-auto gap-3'>
            <img src={image} alt="logo" className='w-10 h-10 rounded-full'/>
            <h1 className='text-3xl text-black font-bold'>Bail Sarathi</h1>
          </div>
          <form onSubmit={handleSubmit} className='flex gap-y-5 flex-col gap-2'>
            <div className='bg-white w-[300px] rounded-md py-2 px-4'>
              <label htmlFor="license" className='border-none text-xs text-gray-500 flex flex-col text-grey bg-transparent'>License:</label>
              <input onChange={handleChange} type="text" placeholder='License' name='license' id='license' className='border-none focus:outline-none  bg-transparent rounded-md'/>
            </div>
            <div className='bg-white w-[300px] rounded-md py-2 px-4'>
              <label htmlFor="password" className='relative border-none text-xs text-gray-500 flex flex-col text-grey bg-transparent'>Password:</label>
              <div className='flex flex-row justify-between'>
                <input onChange={handleChange} type={showPassword ? "text" : "password"} name="password" id="password" placeholder= "Password" className='relative border-none focus:outline-none  bg-transparent rounded-md' />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="right-3 top-[16px] z-[10] cursor-pointer"
                  >
                  {showPassword ? (
                    <IoEyeOffSharp fontSize={20} fill="black" />
                  ) : (
                    <IoEyeSharp fontSize={20} fill="black" />
                  )}
                </span>
              </div>
            </div>
            <button className="mx-auto hover:cursor-pointer bg-[#1E2E45] text-white py-2 px-5 w-max hover:bg-[#33527e]" type='submit'>Log In</button>
          </form>
     
      </div>

      <div>
        <img src={image} alt="image" className='w-max h-[100vh]'/>
      </div>

    </div>
  )
}

export default Login