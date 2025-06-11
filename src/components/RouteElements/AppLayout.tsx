import { Outlet } from 'react-router-dom';
import AppLeftSide from '../Misc/AppLeftSide';
import AppRightSide from '../Misc/AppRightSide';
import MobileBottomNav from '../Misc/MobileAppBottomNav';
import MobileTopNav from '../Misc/MobileAppTopNav';
import MobileNewPostButton from '../Misc/MobileAppNewPostButton';

export default function AppLayout() {
  return (
    <div className='mx-auto my-0 flex min-h-screen max-w-7xl flex-col'>
      <MobileTopNav />
      <div className='flex h-full pb-16 xl:pb-0'>
        <AppLeftSide />
        <Outlet />
        <AppRightSide />
      </div>
      <MobileBottomNav />
      <MobileNewPostButton />
    </div>
  );
}
