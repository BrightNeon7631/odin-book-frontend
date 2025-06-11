import { IoIosChatboxes } from 'react-icons/io';
import HamburgerMenu from './MobileAppTopNavHamburgerMenu';

export default function MobileTopNav() {
  return (
    <div className='flex w-full items-center justify-between p-3 text-slate-400 xl:hidden'>
      <HamburgerMenu />
      <IoIosChatboxes className='flex-grow text-center text-5xl text-blue-800' />
    </div>
  );
}
