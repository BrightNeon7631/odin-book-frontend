import { IoSearch } from 'react-icons/io5';
import { GrLineChart } from 'react-icons/gr';
import AppRightSideSearch from './AppRightSideSearch';
import { useState, useEffect } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';

export default function AppRightSide() {
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
    <div className='hidden w-1/4 p-6 md:flex'>
      <div className='hidden w-full flex-col gap-4 xl:flex'>
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
        {delayedSearch && searchInputValue && (
          <AppRightSideSearch searchPhrase={delayedSearch} />
        )}
        <div>
          <div className='flex items-center gap-2 font-bold'>
            <GrLineChart className='text-blue-800' />
            <div className='text-slate-500'>Trending</div>
          </div>
          <div className='flex flex-wrap pt-2 text-sm'>
            <div className='truncate rounded-full border-2 border-[#212835] p-1.5 text-white'>
              Example #1
            </div>
            <div className='truncate rounded-full border-2 border-[#212835] p-1.5 text-white'>
              Example #2
            </div>
            <div className='truncate rounded-full border-2 border-[#212835] p-1.5 text-white'>
              Example #3
            </div>
            <div className='truncate rounded-full border-2 border-[#212835] p-1.5 text-white'>
              Exampleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee #4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
