import { Outlet } from 'react-router-dom';
import { IoIosChatboxes } from 'react-icons/io';

export default function LoginRegisterLayout() {
  return (
    <div className='flex h-screen bg-[#181d27]'>
      <div className='hidden flex-2 flex-col items-center justify-center gap-4 border-r-2 border-r-[#212835] font-bold md:flex'>
        <IoIosChatboxes className='text-7xl text-blue-800' />
        <div className='text-3xl text-white'>Odin Book</div>
      </div>
      <Outlet />
    </div>
  );
}
