import React, { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import ReactPaginate from 'react-paginate';
import data from "./testing.json";
import { useNavigate, useParams } from 'react-router-dom';

const Admin = () => {
  const itemsPerPage = 8;  

  const navigate = useNavigate();

  const [itemOffset, setItemOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    
    const timeoutId = setTimeout(() => {
      const filteredResults = data.filter(item =>
        item.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className='p-4'>
      <div className='flex flex-row justify-between px-10 py-8'>
        <p className='text-3xl'>Case Details</p>
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
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className='text-center border-b-2 border-gray-400'>
                  <td className='py-2' onClick={() => (navigate(item.applicationNumber))}>{item.applicationNumber}</td>
                  <td className='py-2'>{item.date}</td>
                  <td className='py-2'>{item.ipcSection}</td>
                  <td className='py-2'>{item.previousCase}</td>
                  <td className='py-2'>{item.criminalRecord}</td>
                  <td className='py-2 text-blue-600 underline'><a href={item.document}>view</a></td>
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
};

export default Admin;
