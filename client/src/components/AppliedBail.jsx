import React, { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import ReactPaginate from 'react-paginate';
// import data from "./testing.json";
import { bailoutEndpoints } from '../services/api';
import { apiConnector } from '../services/apiConnector';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../slices/userSlice';
import toast from 'react-hot-toast';
const {LAWYER_BAIL_API}=bailoutEndpoints

const AppliedBail = React.forwardRef((props,ref) => {
    const itemsPerPage = 8;  
    const [data,setData]=useState([]);
    const dispatch=useDispatch();
    const {user}=useSelector((state)=>state.user)
    function formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); 
      const year = String(d.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    }
    const [itemOffset, setItemOffset] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);
  
    useEffect(() => {
      

      const timeoutId = setTimeout(() => {
        const filteredResults = data.filter(item =>
          item.applicationNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filteredResults);
        setItemOffset(0); 
      }, 300); 
  
      return () => clearTimeout(timeoutId);
    }, [searchQuery]); 
    console.log("DATA:",data);

    React.useImperativeHandle(ref,()=>({
      childFunction:async()=>{
        try{
        
          const response=await apiConnector("POST",LAWYER_BAIL_API,{license:user?.license});
          if(!response?.data?.success){
            throw new Error("couldnt get bail applications for the lawyer")
          }
          console.log("RESPONSE:",response);
          setData(response?.data?.bailData);
         
        }
        catch(err){
          console.log("DATA FETCH API ERROR:",err)
  
        }
      }
    }))
    const fetchData=async()=>{
        
      try{
        
        const response=await apiConnector("POST",LAWYER_BAIL_API,{license:user?.license});
        if(!response?.data?.success){
          throw new Error("couldnt get bail applications for the lawyer")
        }
        console.log("RESPONSE:",response);
        setData(response?.data?.bailData);
       
      }
      catch(err){
        console.log("DATA FETCH API ERROR:",err)

      }
    }
    useEffect(()=>{
    fetchData();
    },[])
  
    // Determine the current items to display
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredData.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  
    // Handle page click
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % filteredData.length;
      setItemOffset(newOffset);
    };
  
    // Handle search input change
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };
  
    return (
      <div className='p-4'>
        <div className='flex flex-row justify-between px-10 py-8'>
          <p className='text-3xl'>Yours applied bail</p>
          <form className='flex flex-col'>
            <div className='relative border border-black w-[300px] py-2 px-4'>
              <input
                type='text'
                placeholder='Search for application Number'
                name='search'
                id='license'
                className='relative w-[300px] border-none focus:outline-none bg-transparent rounded-md'
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IoIosSearch className='absolute right-4 top-3 text-gray-500' />
            </div>
          </form>
        </div>
  
        {/* Table Heading */}
        <div className='w-full px-16 grid place-content-center gap-3 place-items-center'>
          <table className='min-w-full place-items-center'>
            <thead>
              <tr className='text-center text-gray-500'>
                <th className='px-6 py-2 '>Application Number</th>
                <th className='px-6 py-2'>Date</th>
                <th className='px-6 py-2'>Jurisdiction</th>
                <th className='px-6 py-2'>Document</th>
                <th className='px-6 py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className='text-center border-b-2 border-gray-400'>
                    <td className='py-2'>{item.applicationNo}</td>
                    <td className='py-2'>{formatDate(Date.now())}</td>
                    <td className='py-2'>{item.jurisdiction}</td>
                    <td className='py-2 text-blue-600 underline'><a className="hover:cursor-pointer" href={item.application}>view</a></td>
                    <td className='py-2 text-green-500'>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className='text-center py-4'>No results found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='mt-4'>
          <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName={"pagination flex justify-center mt-4"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link px-3 py-1 border rounded text-gray-500"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link px-3 py-1 border rounded text-gray-500"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link px-3 py-1 border rounded text-gray-500"}
              activeClassName={"font-bold text-black "}
              />
          </div>
        </div>
      </div>
    );
}
)
export default AppliedBail