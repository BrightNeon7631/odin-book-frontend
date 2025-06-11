import { NavLink } from 'react-router-dom';
import { useLocation, Outlet } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { IoIosCloseCircle } from 'react-icons/io';
import { useState, useEffect } from 'react';

export default function SearchLayout() {
  const path = useLocation()?.pathname;
  const [searchInputValue, setSearchInputValue] = useState('');
  const [delayedSearch, setDelayedSearch] = useState('');

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (searchInputValue !== '') {
        setDelayedSearch(searchInputValue);
      }
    }, 500);
    return () => clearTimeout(timeoutID);
  }, [searchInputValue]);

  return (
    <div className='w-full md:w-xl md:border-2 md:border-[#212835]'>
      <div className='p-2'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search'
            className='h-10 w-full rounded-md bg-[#212835] pl-10 text-white'
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
          />
          <IoSearch className='absolute top-2.5 left-3 text-xl text-white' />
          {searchInputValue && (
            <IoIosCloseCircle
              className='absolute top-2 right-3 cursor-pointer text-2xl text-white'
              onClick={() => setSearchInputValue('')}
            />
          )}
        </div>
      </div>

      <div className='relative flex justify-around border-b-2 border-b-[#212835] p-4 font-bold text-slate-500'>
        <NavLink
          className='hover:text-slate-100 aria-[current=page]:text-slate-100'
          to='.'
          end
        >
          <div>Top</div>
          <span
            className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
              path === '/app/search' ? 'bottom-[-1px] w-8' : 'hidden'
            }`}
          />
        </NavLink>
        <NavLink
          className='hover:text-slate-100 aria-[current=page]:text-slate-100'
          to='latest'
        >
          <div>Latest</div>
          <span
            className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
              path === '/app/search/latest' ? 'bottom-[-1px] w-13' : 'hidden'
            }`}
          />
        </NavLink>
        <NavLink
          className='hover:text-slate-100 aria-[current=page]:text-slate-100'
          to='users'
        >
          <div>Users</div>
          <span
            className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
              path === '/app/search/users' ? 'bottom-[-1px] w-12' : 'hidden'
            }`}
          />
        </NavLink>
      </div>
      {searchInputValue && delayedSearch ? (
        <Outlet context={{ delayedSearch }} />
      ) : (
        <div className='mt-6 flex flex-col items-center gap-2'>
          <IoSearch className='text-7xl font-bold text-white' />
          <p className='text-slate-500'>Find posts and users on Odin Book</p>
        </div>
      )}
    </div>
  );
}
