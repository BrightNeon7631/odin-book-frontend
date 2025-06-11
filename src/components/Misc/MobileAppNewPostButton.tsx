import { HiPencilAlt } from 'react-icons/hi';

export default function MobileNewPostButton() {
  return (
    <div className='fixed right-5 bottom-20 z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-indigo-700 text-3xl text-white hover:opacity-80 xl:hidden'>
      <HiPencilAlt />
    </div>
  );
}
