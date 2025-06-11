import { AiOutlineHome, AiOutlineMessage } from 'react-icons/ai';
import { IoSearch } from 'react-icons/io5';
import { FaRegBell } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { NavLink, useLocation } from 'react-router-dom';

export default function MobileBottomNav() {
  const path = useLocation()?.pathname;

  return (
    <div className='fixed right-0 bottom-0 left-0 flex justify-between border-t-2 border-t-[#212835] bg-[#181d27] px-8 py-4 text-slate-400 xl:hidden'>
      <NavLink
        end
        to=''
        className={`hover:text-slate-100 aria-[current=page]:text-slate-100 ${
          path === '/app/discover' ? 'text-slate-100' : ''
        }`}
      >
        <AiOutlineHome className='text-3xl' />
      </NavLink>
      <NavLink
        to='/app/search'
        className='hover:text-slate-100 aria-[current=page]:text-slate-100'
      >
        <IoSearch className='text-3xl' />
      </NavLink>
      <NavLink
        to='/app/chats'
        className='hover:text-slate-100 aria-[current=page]:text-slate-100'
      >
        <AiOutlineMessage className='text-3xl' />
      </NavLink>
      <NavLink
        to='/app/notifications'
        className='hover:text-slate-100 aria-[current=page]:text-slate-100'
      >
        <FaRegBell className='text-3xl' />
      </NavLink>
      <NavLink
        to='/app/account'
        className='hover:text-slate-100 aria-[current=page]:text-slate-100'
      >
        <FaCircleUser className='text-3xl' />
      </NavLink>
    </div>
  );
}
