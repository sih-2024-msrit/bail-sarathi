import React from 'react'
import { ImParagraphRight } from "react-icons/im";
import { IoMdSearch } from "react-icons/io"
import image from '../assets/dummy.png'


const Navbar = () => {
  return (
    <div className='bg-slateblue place-items-center text-white justify-between py-8 px-16 flex flex-row'>
        <div className='flex flex-row gap-5 place-items-center'>
            <img src={image} className='w-10 h-10 fit-cover '/>
            <p className='text-xl'>Bail Sarathi</p>
        </div>
        <div className='flex flex-row gap-3 place-items-center'>
            <ImParagraphRight className='text-2xl '/>
            <IoMdSearch className='text-2xl'/>

        </div>
    </div>
  )
}

export default Navbar