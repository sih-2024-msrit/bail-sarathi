import React from 'react'

const AdminDashboard = () => {
  const topics = ['Case No', 'Other Cases', 'Ipc Number', 'odbfjnm']
  const [topic, setTopic] = React.useState(0)
  const [description, setDescription] = React.useState('ertgjiewkfnekjdgnbrkjfdgnvrjdkgnrfjkdmn ')
  return (
    <div className='text-black'>
      <div className='p-3 gap-y-6 w-[50%] border mx-auto border-white'>
        <div className='flex flex-row gap-4 justify-items-start'>
          {
            topics.map((top, index) => (
              <button
                key={index}
                onClick={() => setTopic(index)}
                className={`rounded-lg border-0 ${topic === index ? 'text-black' : 'text-[#808080]'}`}
              >
                {top}
              </button>
            ))
          }
        </div>
        <div className='text-lg mt-7'>
        In the context of the command prompt (cmd), "ping" stands for Packet Internet Groper. It is a utility used to test the reachability of a host on an IP network by sending ICMP (Internet Control Message Protocol) echo request packets and waiting for a reply. This is often used to diagnose network connectivity issues.
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard