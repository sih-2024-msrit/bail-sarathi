import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Admin from '../components/Admin'

const AdminDashboard = () => {
  

  
  return (
    <div className='min-h-[100vh] relative'>
      <Navbar/>
      <Admin/>
      <div className='bottom-0 absolute w-full'>
      <Footer/>
      </div>
    </div>
  )
}

export default AdminDashboard