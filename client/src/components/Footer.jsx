import React from 'react'
import dummy from '../assets/dummy.png'
import { IoLogoInstagram, IoLogoTwitter, IoLogoFacebook, IoLogoLinkedin } from "react-icons/io";


const Footer = () => {
  return (
    <div className='bg-slateblue bottom-0 grid py-10 gap-y-2 text-sm place-content-center place-items-center text-white mt-10'>
        <div className='flex flex-row gap-5 mb-8'>
            <img src={dummy} alt="logo" className='w-10 h-10'/>
            <p className='text-white text-xl my-auto'>Bail Sarathi</p>
        </div>
        <div className='flex flex-row gap-2'>
            <IoLogoFacebook/>
            <IoLogoInstagram/>
            <IoLogoTwitter/>
            <IoLogoLinkedin/>
        </div>
        <div className='flex flex-row gap-4'>
            <p>Term of use</p>
            <p>Privacy policy</p>
        </div>

        <p className='mt-4'>Copyright @2024 Bail Sarathi All Right Reserved</p>
        
    </div>
  )
}

export default Footer