import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineLogout,
} from 'react-icons/ai';
import { IoSearch } from 'react-icons/io5';
import { FaRegBell } from 'react-icons/fa';
import { FaCircleUser, FaList } from 'react-icons/fa6';
import { IoIosChatboxes } from 'react-icons/io';
import { FiSettings } from 'react-icons/fi';
import { HiPencilAlt } from 'react-icons/hi';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { type AuthContextType } from '../../../types';

export default function AppLeftSide() {
  const { logout } = useAuth() as AuthContextType;
  const path = useLocation()?.pathname;
  return (
    <div className='hidden w-1/4 justify-end p-6 md:flex'>
      <div className='hidden flex-col gap-6 text-slate-400 xl:flex'>
        <div className='flex items-center gap-2'>
          <IoIosChatboxes className='text-7xl text-blue-800' />
          <div className='text-3xl font-bold text-white'>Odin Book</div>
        </div>
        <NavLink
          to='.'
          end
          className={`flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100 ${
            path === '/app/discover' ? 'text-slate-100' : ''
          }`}
        >
          <AiOutlineHome className='text-3xl' />
          <div className='text-2xl'>Home</div>
        </NavLink>
        <NavLink
          to='search'
          className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
        >
          <IoSearch className='text-3xl' />
          <div className='text-2xl'>Search</div>
        </NavLink>
        <NavLink
          to='notifications'
          className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
        >
          <FaRegBell className='text-3xl' />
          <div className='text-2xl'>Notifications</div>
        </NavLink>
        <NavLink
          to='chats'
          className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
        >
          <AiOutlineMessage className='text-3xl' />
          <div className='text-2xl'>Chats</div>
        </NavLink>
        <NavLink
          to='lists'
          className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
        >
          <FaList className='text-3xl' />
          <div className='text-2xl'>Lists</div>
        </NavLink>
        <NavLink
          to='account'
          className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
        >
          <FaCircleUser className='text-3xl' />
          <div className='text-2xl'>Account</div>
        </NavLink>
        <NavLink
          to='settings'
          className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
        >
          <FiSettings className='text-3xl' />
          <div className='text-2xl'>Settings</div>
        </NavLink>
        <div
          className='flex items-center gap-3 hover:cursor-pointer hover:text-slate-100'
          onClick={logout}
        >
          <AiOutlineLogout className='text-3xl' />
          <div className='text-2xl'>Sign out</div>
        </div>
        <button className='mt-3 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-3xl bg-indigo-700 p-2 text-lg font-bold text-white hover:opacity-80'>
          <HiPencilAlt />
          <div>New Post</div>
        </button>
      </div>
    </div>
  );
}
