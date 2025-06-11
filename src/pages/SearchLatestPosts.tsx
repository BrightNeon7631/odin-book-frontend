import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type PostAllData } from '../../types';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { fakeLoading } from '../utils/mockData';
import { useOutletContext } from 'react-router-dom';
import PostsContainer from '../components/Reusables/PostsContainer';

const getLatestUserPosts = async (
  text: string,
  pageParam?: number | null,
) => {
  const res = await axios.get<PostAllData[]>(
    `/post/latest/text/${text}?cursor=${pageParam}`,
  );
  await fakeLoading(1000);
  return res.data;
};

export default function SearchLatestPosts() {
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
    queryKey: ['searchLatestPostsPage', delayedSearch],
    queryFn: ({ pageParam = 0 }) => {
      if (!delayedSearch) {
        throw new Error('Search phrase is required.');
      }
      return getLatestUserPosts(delayedSearch, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.length < 5;
      return isLastPage ? null : lastPage[lastPage.length - 1].id;
    },
  });

  const posts = data?.pages.flatMap((page) => page) || [];

  if (isPending) {
    return (
      <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
    );
  }

  return (
    <PostsContainer
      posts={posts}
      isError={isError}
      error={error}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      searchId={delayedSearch}
    />
  );
}
