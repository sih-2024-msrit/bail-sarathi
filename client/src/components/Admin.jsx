import React, { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import ReactPaginate from 'react-paginate';
// import data from "./testing.json";
import {useSelector} from  "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { bailoutEndpoints } from '../services/api';


const { JUDGE_BAIL_API } = bailoutEndpoints;

const Admin = () => {
  const itemsPerPage = 8;  

  const {user} = useSelector((state) => state.user);

  const [data, setData] = useState([]);

  useEffect(() => {
    const bailApplpication = async () => {
      console.log("license:",user.license);
      try {
        console.log("api call start");
        const response=await apiConnector("POST",JUDGE_BAIL_API,{judgeLicense:user.license});
          if(!response?.data?.success){
            throw new Error("response mein error")
          }
          console.log("response:",response.data);
          setData(response?.data?.bailData);
          setFilterAppData(response?.data?.bailData);
         
        }
        catch(err){
          console.log("api error:",err)
        }
      }
    bailApplpication();
  }, []);


  const navigate = useNavigate();
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }
  const [itemOffset, setItemOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [filterAppData, setFilterAppData] = useState(data);

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

  const filterAppDatas = (status) => {
    if (status === 'All') {
      setFilterAppData(data);
    } else {
      const filteredResults = data.filter(item =>
        item.status.toLowerCase().includes(status.toLowerCase())
      );
      setFilterAppData(filteredResults);
    }
  }

  return (
    <div className='p-4'>
      <div className='flex flex-row justify-between px-10 py-8'>
        <p className='text-3xl dm-serif-display'>Case Details</p>
        <div className='flex flex-row gap-4'>
            <div className='flex border border-black mr-3 gap-4 p-2'>
            <button onClick={()=>(filterAppDatas('All'))}>All</button>
            <button onClick={()=>(filterAppDatas('Pending'))}>Pending</button>
            <button onClick={()=>(filterAppDatas('Rejected'))}>Rejected</button>
            <button onClick={()=>(filterAppDatas('Accepted'))}>Accepted</button>
          </div>
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
      </div>

      {/* Table Heading */}
      <div className='w-full px-16 grid place-content-center gap-3 place-items-center'>
        <table className='min-w-full place-items-center'>
          <thead>
            <tr className='text-center text-gray-500'>
              <th className='px-6 py-2 text-lg dm-serif-display'>Application Number</th>
              <th className='px-6 py-2 text-lg dm-serif-display'>Date</th>
              <th className='px-6 py-2 text-lg dm-serif-display'>Jurisdiction</th>
              <th className='px-6 py-2 text-lg dm-serif-display'>Document</th>
              <th className='px-6 py-2 text-lg dm-serif-display'>Status</th>
            </tr>
          </thead>
          <tbody>
            {filterAppData.length > 0 ? (
              filterAppData.map((item, index) => (
                <tr key={index} className='text-center border-b-2 border-gray-400'>
                  <td className='py-2 hover:cursor-pointer' onClick={() => (navigate(item.applicationNo))}>{item.applicationNo}</td>
                  <td className='py-2'>{formatDate(Date.now())}</td>
                  <td className='py-2'>{item.jurisdiction}</td>
                  <td className='py-2 text-blue-600 hover:cursor-pointer underline'><a target="_blank"  href={item.application}>view</a></td>
                  <td className={`py-2 ${item.status == 'accepted' ? "text-green-500" :item.status == 'rejected'? "text-red-500" : "text-blue-500" }`}>{item.status} </td>
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
};

export default Admin;
