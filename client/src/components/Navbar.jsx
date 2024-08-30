import React from 'react'
import { ImParagraphRight } from "react-icons/im";
import { IoMdSearch } from "react-icons/io"
import image from '../assets/dummy.png'
import ministry from "../assets/ministryy.png"


const Navbar = () => {
  return (
    <div className='bg-slateblue place-items-center text-white justify-between flex flex-row'>
        <div className='flex flex-row gap-5 place-items-center'>
          <div className='px-16 py-8 gap-4 flex flex-row'>
            <img src={image} className='w-10 h-10 fit-cover '/>
            <p className='text-xl my-auto'>Bail Sarathi</p>
          </div>
            <img src={ministry} className='ml-3 w-[200px] fit-cover '/>
        </div>
        <div className='flex flex-row gap-3 py-8 px-16 place-items-center'>
            <ImParagraphRight className='text-2xl '/>
            <IoMdSearch className='text-2xl'/>

        </div>
    </div>
  )
}

export default Navbar