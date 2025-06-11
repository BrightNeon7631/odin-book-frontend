import { useState, useRef, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
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

export default function HamburgerMenu() {
  const { logout } = useAuth() as AuthContextType;
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location?.pathname;

  // closes the menu upon page change
  useEffect(() => {
    closeMenu();
  }, [location]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    // event listener to detect clicks outside the menu
    document.addEventListener('mousedown', handleClickOutside);

    // clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <GiHamburgerMenu
        onClick={() => setIsOpen(true)}
        className='cursor-pointer text-3xl hover:text-white'
      />
      {isOpen && (
        <div className='fixed inset-0 z-40 bg-black/50'>
          <div
            ref={menuRef}
            className='fixed top-0 left-0 flex h-full w-full flex-col gap-8 bg-[#181d27] p-5 shadow-lg md:w-1/2'
          >
            <button
              onClick={closeMenu}
              className='absolute top-5 right-5 cursor-pointer text-3xl hover:text-white'
            >
              &times;
            </button>
            <div className='flex items-center gap-2'>
              <IoIosChatboxes className='text-7xl text-blue-800' />
              <div className='text-3xl font-bold text-white'>Odin Book</div>
            </div>
            <hr className='text-[#212835]'></hr>
            <div className='flex flex-col gap-6'>
              <NavLink
                to=''
                end
                className={`flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100 ${
                  path === '/app/discover' ? 'text-slate-100' : ''
                }`}
              >
                <AiOutlineHome className='text-3xl' />
                <div className='text-2xl'>Home</div>
              </NavLink>
              <NavLink
                to='/app/search'
                className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
              >
                <IoSearch className='text-3xl' />
                <div className='text-2xl'>Search</div>
              </NavLink>
              <NavLink
                to='/app/notifications'
                className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
              >
                <FaRegBell className='text-3xl' />
                <div className='text-2xl'>Notifications</div>
              </NavLink>
              <NavLink
                to='/app/chats'
                className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
              >
                <AiOutlineMessage className='text-3xl' />
                <div className='text-2xl'>Chats</div>
              </NavLink>
              <NavLink
                to='/app/lists'
                className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
              >
                <FaList className='text-3xl' />
                <div className='text-2xl'>Lists</div>
              </NavLink>
              <NavLink
                to='/app/account'
                className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
              >
                <FaCircleUser className='text-3xl' />
                <div className='text-2xl'>Account</div>
              </NavLink>
              <NavLink
                to='/app/settings'
                className='flex items-center gap-3 hover:text-slate-100 aria-[current=page]:text-slate-100'
              >
                <FiSettings className='text-3xl' />
                <div className='text-2xl'>Settings</div>
              </NavLink>
              <div className='flex items-center gap-3 hover:cursor-pointer hover:text-slate-100'>
                <AiOutlineLogout className='text-3xl' onClick={logout} />
                <div className='text-2xl'>Sign out</div>
              </div>
              <hr className='text-[#212835]'></hr>
              <button className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-3xl bg-indigo-700 p-2 text-lg font-bold text-white hover:opacity-80'>
                <HiPencilAlt />
                <div>New Post</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
