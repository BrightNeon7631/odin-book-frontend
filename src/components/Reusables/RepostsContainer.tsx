import InfiniteScrollContainer from './InfiniteScrollContainer';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { type RepostsAllData } from '../../../types';
import Post from './Post';
import {
  type FetchNextPageOptions,
  type InfiniteQueryObserverResult,
  type InfiniteData,
} from '@tanstack/react-query';

type RepostsContainerProps = {
  isError: boolean;
  isPending: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  repostsData: RepostsAllData[];
  userPageId?: string;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<RepostsAllData[], unknown>,
      Error
    >
  >;
};

export default function RepostsContainer({
  isError,
  isPending,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  error,
  repostsData,
  fetchNextPage,
  userPageId
}: RepostsContainerProps) {
  const renderReposts = repostsData.map((repost) => {
    return (
      <Post
        key={repost.id}
        id={repost.post.id}
        user={repost.post.user}
        time={repost.post.createdAt}
        text={repost.post?.text}
        replies={repost.post._count.replies}
        reposts={repost.post._count.reposts}
        likes={repost.post._count.likes}
        images={repost.post?.images}
        replyPost={repost.post?.replyToPost}
        repostedBy={repost.user.userName}
        repostedByUserId={repost.user.id}
        isLikedByLoggedInUser={repost.post.isLikedByLoggedInUser}
        isRepostedByLoggedInUser={repost.post.isRepostedByLoggedInUser}
        userPageId={userPageId}
      />
    );
  });

  return (
    <div className='flex flex-col'>
      {!isError && repostsData.length === 0 && !isPending && (
        <div className='py-4 text-center text-slate-500'>No reposts yet.</div>
      )}
      <InfiniteScrollContainer
        onPageBottomReached={() =>
          hasNextPage && !isFetching && fetchNextPage()
        }
      >
        {renderReposts}
        {(isFetchingNextPage || isPending) && (
          <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
        )}
      </InfiniteScrollContainer>
      {isError && (
        <div className='py-4 text-center text-red-500'>
          There was an error fetching data: {error?.message}
        </div>
      )}
      {repostsData.length > 0 && !hasNextPage && !isPending && (
        <div className='py-4 text-center text-slate-500'>End of feed</div>
      )}
    </div>
  );
}
