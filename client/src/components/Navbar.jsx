import React, { useState } from 'react'
import { ImParagraphRight } from "react-icons/im";
import image from '../assets/dummy.png'
import ministry from "../assets/image.png"
import ProfileMenu from './ProfileMenu';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className='bg-slateblue place-items-center text-white justify-between flex flex-row'>
        <div className='flex flex-row gap-5 place-items-center'>
          <div className='px-16 py-8 gap-4 flex flex-row'>
            <img src={image} alt="logo" className='w-48'/>
            {/* <p className='text-xl my-auto'>Bail Sarathi</p> */}
          </div>
            <img src={ministry} alt="ministryLogo" className='w-[200px] fit-cover '/>
        </div>
        <div className='flex flex-row gap-3 py-8 px-16 place-items-center'>
          <div onClick={() => toggleMenu()} className='relative'>
            <ImParagraphRight className='text-2xl'/>
            {
              isOpen &&
              <div className='absolute right-0 top-8 bg-white p-4 rounded-md shadow-lg'>
                <ProfileMenu />
              </div>
            }
          </div>

        </div>
    </div>
  )
}

export default Navbar