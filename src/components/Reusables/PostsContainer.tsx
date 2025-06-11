import InfiniteScrollContainer from './InfiniteScrollContainer';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { type PostAllData } from '../../../types';
import Post from './Post';
import {
  type FetchNextPageOptions,
  type InfiniteQueryObserverResult,
  type InfiniteData,
} from '@tanstack/react-query';

type PostsContainerProps = {
  isError: boolean;
  isPending: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  posts: PostAllData[];
  userPageId?: string;
  searchId?: string;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<PostAllData[], unknown>,
      Error
    >
  >;
};

export default function PostsContainer({
  isError,
  isPending,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  error,
  posts,
  userPageId,
  searchId,
  fetchNextPage,
}: PostsContainerProps) {
  const renderPosts = posts.map((post) => {
    return (
      <Post
        key={post.id}
        id={post.id}
        user={post.user}
        time={post.createdAt}
        text={post?.text}
        replies={post._count.replies}
        reposts={post._count.reposts}
        likes={post._count.likes}
        images={post?.images}
        replyPost={post?.replyToPost}
        isLikedByLoggedInUser={post.isLikedByLoggedInUser}
        isRepostedByLoggedInUser={post.isRepostedByLoggedInUser}
        userPageId={userPageId}
        searchId={searchId}
      />
    );
  });

  return (
    <div className='flex flex-col'>
      {!isError && posts.length === 0 && !isPending && (
        <div className='py-4 text-center text-slate-500'>No posts yet.</div>
      )}
      {/* !isFetching to avoid race conditions (can't have multiple fetches at the same time) */}
      <InfiniteScrollContainer
        onPageBottomReached={() =>
          hasNextPage && !isFetching && fetchNextPage()
        }
      >
        {renderPosts}
        {(isFetchingNextPage || isPending) && (
          <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
        )}
      </InfiniteScrollContainer>
      {isError && (
        <div className='py-4 text-center text-red-500'>
          There was an error fetching data: {error?.message}
        </div>
      )}
      {posts.length > 0 && !hasNextPage && !isPending && (
        <div className='py-4 text-center text-slate-500'>End of feed</div>
      )}
    </div>
  );
}
