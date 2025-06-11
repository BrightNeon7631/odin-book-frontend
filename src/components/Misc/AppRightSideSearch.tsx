import { type UserSearch } from '../../../types';
import { FaUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fakeLoading } from '../../utils/mockData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const getUsers = async (searchPhrase: string, pageParam?: number | null) => {
  const res = await axios.get<UserSearch[]>(
    `/user/name/${searchPhrase}?cursor=${pageParam}`,
  );
  await fakeLoading(1000);
  return res.data;
};

export default function AppRightSideSearch({
  searchPhrase,
}: {
  searchPhrase: string;
}) {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['searchUsers', searchPhrase],
    queryFn: ({ pageParam = 0 }) => {
      return getUsers(searchPhrase, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.length < 3; // Assuming you requested 3 users
      return isLastPage ? null : lastPage[lastPage.length - 1].id;
    },
  });

  const users = data?.pages.flatMap((page) => page) || [];

  const renderUsers = users.map((user) => {
    return (
      <Link
        to={`/app/user/${user.id}`}
        className='flex gap-4 truncate rounded-lg p-3 hover:bg-[#1d232e]'
        key={user.id}
      >
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-3xl select-none'>
          {user.userAvatar ? (
            <img src={user.userAvatar} className='h-12 w-12 rounded-full' />
          ) : (
            <FaUser />
          )}
        </div>
        <div className='flex flex-col gap-0.5'>
          <div className='font-bold text-white'>{user.userName}</div>
          <div className='text-slate-500'>@{user.userHandle}</div>
        </div>
      </Link>
    );
  });

  return (
    <div className='rounded-lg border-2 border-[#212835] max-h-64 overflow-y-auto scrollbar'>
      <div className='truncate border-2 border-x-0 border-t-0 border-b-[#212835] p-3 text-white'>
        Search for "{searchPhrase}"
      </div>
      <div className='flex flex-col'>
        {!isError && users.length === 0 && !isPending && (
          <div className='py-4 text-center text-slate-500'>No users found.</div>
        )}
        <>
          {renderUsers}
          {isFetchingNextPage || isPending ? (
            <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
          ) : hasNextPage ? (
            <p
              className='cursor-pointer text-center text-slate-500 hover:text-white'
              onClick={() => fetchNextPage()}
            >
              Fetch more users
            </p>
          ) : null}
        </>
        {isError && (
          <div className='py-4 text-center text-red-500'>
            There was an error fetching data: {error?.message}
          </div>
        )}
      </div>
    </div>
  );
}
