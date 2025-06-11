import { NavLink } from 'react-router-dom';
import { useLocation, Outlet } from 'react-router-dom';

export default function HomeLayout() {
  const path = useLocation()?.pathname;

  return (
    <div className='w-full md:w-xl md:border-2 md:border-[#212835]'>
      <div className='relative flex justify-around border-b-2 border-b-[#212835] p-4 font-bold text-slate-500'>
        <NavLink
          className='hover:text-slate-100 aria-[current=page]:text-slate-100'
          to='/app'
          end
        >
          <div>Feed</div>
          <span
            className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
              path === '/app' ? 'bottom-[-1px] w-10' : 'hidden'
            }`}
          />
        </NavLink>
        <NavLink
          className='hover:text-slate-100 aria-[current=page]:text-slate-100'
          to='discover' 
        >
          <div>Discover</div>
          <span
            className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
              path === '/app/discover' ? 'bottom-[-1px] w-18' : 'hidden'
            }`}
          />
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}