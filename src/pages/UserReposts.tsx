import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type RepostsAllData } from '../../types';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { fakeLoading } from '../utils/mockData';
import { useOutletContext } from 'react-router-dom';
import RepostsContainer from '../components/Reusables/RepostsContainer';

const getLatestUserReposts = async (
  userId: string | number,
  pageParam?: number | null,
) => {
  const res = await axios.get<RepostsAllData[]>(
    `/post/latest/user/${userId}/reposts?cursor=${pageParam}`,
  );
  await fakeLoading(1000);
  return res.data;
};

export default function UserReposts() {
  const { userId } = useOutletContext<{ userId: string | undefined }>();

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
    queryKey: ['latestUserReposts', userId],
    queryFn: ({ pageParam = 0 }) => {
      if (!userId) {
        throw new Error('ID is required.');
      }
      return getLatestUserReposts(userId, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.length < 5;
      return isLastPage ? null : lastPage[lastPage.length - 1].id;
    },
  });

  const reposts = data?.pages.flatMap((page) => page) || [];
  console.log(data, reposts)

  if (isPending) {
    return (
      <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
    );
  }

  return (
    <RepostsContainer
      repostsData={reposts}
      isError={isError}
      error={error}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      userPageId={userId}
    />
  );
}
