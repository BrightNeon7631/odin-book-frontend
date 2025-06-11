import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type PostAllData } from '../../types';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { fakeLoading } from '../utils/mockData';
import PostsContainer from '../components/Reusables/PostsContainer';

const getLatestPostsFromFollowedUsers = async ({
  pageParam,
}: {
  pageParam: number | null;
}) => {
  const res = await axios.get<PostAllData[]>(
    `/post/latest/followed?cursor=${pageParam}`,
  );
  await fakeLoading(1000);
  return res.data;
};

export default function HomePosts() {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    isPending, // only true for the first page
    isFetching, // true for whichever page
  } = useInfiniteQuery({
    queryKey: ['latestPostsFollowed'],
    queryFn: getLatestPostsFromFollowedUsers,
    initialPageParam: 0,
    // A function that determines the next cursor for pagination. If there are no more posts, it returns null,
    //  indicating that there are no more pages to fetch.
    getNextPageParam: (lastPage) => {
      // Check if the last page has posts and if the number of posts is equal to the requested number.
      const isLastPage = lastPage.length < 5; // Assuming you requested 5 posts
      // If there are more posts to fetch, it returns the ID of the last post in the current page, which will
      // be used as the cursor for the next request.
      // If the length of lastPage is less than the number of posts you requested (meaning there are no more
      // posts to fetch) - return null.
      return isLastPage ? null : lastPage[lastPage.length - 1].id;
    },
  });

  // flatten the data into a single array of posts
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
    />
  );
}
