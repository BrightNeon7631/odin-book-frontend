import { type UserSearch } from '../../types';
import axios from 'axios';
import { fakeLoading } from '../utils/mockData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useOutletContext } from 'react-router-dom';
import InfiniteScrollContainer from '../components/Reusables/InfiniteScrollContainer';
import SearchUserCard from '../components/Reusables/SearchUserCard';

const getUsers = async (searchPhrase: string, pageParam?: number | null) => {
  const res = await axios.get<UserSearch[]>(
    `/user/name/${searchPhrase}?cursor=${pageParam}`,
  );
  await fakeLoading(1000);
  return res.data;
};

export default function SearchUsers() {
  const { delayedSearch } = useOutletContext<{
    delayedSearch: string | undefined;
  }>();

  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    isPending,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['searchUsersPage', delayedSearch],
    queryFn: ({ pageParam = 0 }) => {
      if (!delayedSearch) {
        throw new Error('Search phrase is required.');
      }
      return getUsers(delayedSearch, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.length < 5;
      return isLastPage ? null : lastPage[lastPage.length - 1].id;
    },
  });

  const users = data?.pages.flatMap((page) => page) || [];

  const renderUsers = users.map((user) => {
    return (
      <SearchUserCard
        key={user.id}
        userId={user.id}
        about={user?.about}
        userAvatar={user?.userAvatar}
        userHandle={user?.userHandle}
        userName={user.userName}
        isFollowedByLoggedInUser={user.isFollowedByLoggedInUser}
        searchPhrase={delayedSearch}
      />
    );
  });

  if (!delayedSearch) {
    return null;
  }

  if (isPending) {
    return (
      <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
    );
  }

  return (
    <div className='flex flex-col'>
      {!isError && users.length === 0 && !isPending && (
        <div className='py-4 text-center text-slate-500'>No users yet.</div>
      )}
      <InfiniteScrollContainer
        onPageBottomReached={() =>
          hasNextPage && !isFetching && fetchNextPage()
        }
      >
        {renderUsers}
        {(isFetchingNextPage || isPending) && (
          <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
        )}
      </InfiniteScrollContainer>
      {isError && (
        <div className='py-4 text-center text-red-500'>
          There was an error fetching data: {error?.message}
        </div>
      )}
      {users.length > 0 && !hasNextPage && !isPending && (
        <div className='py-4 text-center text-slate-500'>End of search</div>
      )}
    </div>
  );
}
