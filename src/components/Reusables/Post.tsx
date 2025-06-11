import { FaUser } from 'react-icons/fa6';
import { addYears, format, formatDistanceToNow, isAfter } from 'date-fns';
import { FaRegCommentAlt, FaRegHeart } from 'react-icons/fa';
import { FaRetweet } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import ReplyToPost from './ReplyToPost';
import PostImages from './PostImages';
import ImageModal from '../Misc/ImageModal';
import { useState } from 'react';
import { ReplyToPostTypes } from './ReplyToPost';
import PostClipboard from './PostClipboard';
import {
  type PostAllData,
  type RepostsAllData,
  type AuthContextType,
} from '../../../types';
import axios from 'axios';
import { fakeLoading } from '../../utils/mockData';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { generateUniqueNumericId } from '../../utils/functions';

import { useAuth } from '../../provider/authProvider';

export type User = {
  id: number;
  userName: string;
  userHandle: string;
  userAvatar?: string | null;
};

type Repost = {
  id: number;
  createdAt: Date;
  userId: number;
  postId: number;
};

/* 
latestPosts etc. query (before the flatten function applied) returns data with pagination and looks like this:
{pages: Array(2), pageParams: Array(2)}
pageParams: Array(2)
0: 0
1: 10

pages: Array(2)
0: (5) [{…}, {…}, {…}, {…}, {…}]
1: (3) [{…}, {…}, {…}]
*/

type OldPosts = {
  pageParams: number[];
  pages: PostAllData[][];
};

type OldReposts = {
  pageParams: number[];
  pages: RepostsAllData[][];
};

// When using useMutation, the mutationFn should accept a single argument that contains all the necessary
// parameters for the mutation. To resolve this, the function can accept a single object as an argument that
// contains properties. This way, the entire object can be passed to the mutation function.
const toggleRepost = async ({
  isRepostedByUser,
  postId,
}: {
  isRepostedByUser: boolean;
  postId: number;
  // workaround, so that this function can be accepted by the optimistic update function
  loggedInUserId?: number | null;
}) => {
  if (isRepostedByUser) {
    await fakeLoading(2000);
    await axios.delete(`/post/${postId}/repost`);
  } else {
    await fakeLoading(2000);
    const res = await axios.post<Repost>(`/post/${postId}/repost`);
    return res.data;
  }
};

const toggleLike = async ({
  isLikedByUser,
  postId,
}: {
  isLikedByUser: boolean;
  postId: number;
  loggedInUserId?: number | null;
}) => {
  if (isLikedByUser) {
    await fakeLoading(2000);
    const res = await axios.post<{ message: string }>(`/post/${postId}/unlike`);
    return res.data;
  } else {
    await fakeLoading(2000);
    const res = await axios.post<{ message: string }>(`/post/${postId}/like`);
    return res.data;
  }
};

type PostTypes = {
  id: number;
  user: User;
  time: Date;
  text?: string | null;
  images?: string[];
  replyPost?: ReplyToPostTypes | null;
  replies: number | string;
  reposts: number | string;
  likes: number | string;
  // userName of the user who reposted the post
  repostedBy?: string | null;
  repostedByUserId?: number | null;
  isLikedByLoggedInUser: boolean;
  isRepostedByLoggedInUser: boolean;
  // optional id of the user whose page we're currently on (e.g. user/1/replies)
  userPageId?: string | null;
  // optional search phrase (e.g. 'test') when using the search function
  searchId?: string | null;
};

export default function Post({
  id,
  user,
  time,
  text,
  images,
  replyPost,
  replies,
  reposts,
  likes,
  repostedBy,
  repostedByUserId,
  isLikedByLoggedInUser,
  isRepostedByLoggedInUser,
  userPageId,
  searchId,
}: PostTypes) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const domain = window.location.host;
  const [imagesModal, setImagesModal] = useState<number | null>(null);
  const [isDotsModalOpen, setIsDotsModalOpen] = useState<boolean>(false);

  // another user object already exists as a prop; the destructured user from the context can be renamed
  const { user: contextUser } = useAuth() as AuthContextType;

  const toggleDotsModal = (e: React.MouseEvent<SVGAElement, MouseEvent>) => {
    e.stopPropagation();
    setIsDotsModalOpen(!isDotsModalOpen);
  };

  const selectImg = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    imgArrayPosition: number,
  ) => {
    e.stopPropagation();
    setImagesModal(imgArrayPosition);
  };

  const addDataToClipboard = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: string | undefined | null,
  ) => {
    e.stopPropagation();
    if (!data) return;
    navigator.clipboard.writeText(data);
  };

  const handlePostClick = () => {
    navigate(`/app/post/${id}`);
  };

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/app/user/${user.id}`);
  };

  const postDate = () => {
    const currentDate = new Date();
    const postDateAfter1Y = addYears(time, 1);
    const isPostAfter1Y = isAfter(currentDate, postDateAfter1Y);

    if (isPostAfter1Y) {
      return format(time, 'dd/MM/yyyy'); // e.g. '10/12/24'
    } else {
      // this function takes a date and returns a string representing the distance from that date to now
      // e.g. 30m
      // addSuffix: true option adds 'ago' etc. to the output
      return `${formatDistanceToNow(time, {
        addSuffix: true,
      })}`;
    }
  };

  // id of the user who created the post
  // converted to string since queryKey was defined as string (number type would count as a different key)
  // 1 and '1' are different keys
  const postUserId = user.id.toString();

  // id of the logged in user
  const currentUserId = contextUser?.id.toString();

  // id of the user who reposted the post
  const repostUserId = repostedByUserId?.toString();

  const handleOptimisticRepostChange = (
    oldPostsData: OldPosts | undefined,
    data: {
      isRepostedByUser: boolean;
      postId: number;
    },
  ) => {
    // handle case where oldPostsData might be undefined
    if (!oldPostsData) return { pageParams: [0], pages: [[]] };
    return {
      ...oldPostsData,
      pages: oldPostsData.pages.map((oldPostsArray) => {
        return oldPostsArray.map((post) => {
          return post.id === data.postId
            ? {
                ...post,
                isRepostedByLoggedInUser: !post.isRepostedByLoggedInUser,
                _count: {
                  ...post._count,
                  reposts: data.isRepostedByUser
                    ? post._count.reposts - 1
                    : post._count.reposts + 1,
                },
              }
            : post;
        });
      }),
    };
  };

  const handleOptimisticRepostChangeUserRepostsPage = (
    oldRepostsData: OldReposts | undefined,
    data: {
      isRepostedByUser: boolean;
      postId: number;
      loggedInUserId?: number | string | null;
    },
  ) => {
    // handle case where oldReposts might be undefined
    if (!oldRepostsData) return { pageParams: [0], pages: [[]] };
    // handle case where User A removed the repost of some post
    // this repost should be removed from the User A/Reposts page to avoid bugs
    if (data.loggedInUserId && data.isRepostedByUser) {
      return {
        ...oldRepostsData,
        pages: oldRepostsData.pages.map((oldRepostsArray) => {
          return oldRepostsArray.filter(
            (repost) => repost.post.id !== data.postId,
          );
        }),
      };
      // user A reposted some post and it should appear in User A's reposts page
    } else if (data.loggedInUserId && !data.isRepostedByUser) {
      return {
        ...oldRepostsData,
        pages: [
          [
            {
              // this will be a temporary key value for the Post component (inside the RepostsContainer?)
              id: generateUniqueNumericId(),
              post: {
                id,
                user,
                createdAt: time,
                text,
                images,
                replyToPost: replyPost,
                isLikedByLoggedInUser,
                isRepostedByLoggedInUser: true,
                _count: { likes, replies, reposts: Number(reposts) + 1 },
              },
              user: { userName: contextUser?.userName, id: contextUser?.id },
            },
          ],
          ...oldRepostsData.pages,
        ],
      };
    }
    // if User A reposted User B's post on their reposts page then just the repost count value should be updated
    else {
      return {
        ...oldRepostsData,
        pages: oldRepostsData.pages.map((oldRepostsArray) => {
          return oldRepostsArray.map((repost) => {
            return repost.post.id === data.postId
              ? {
                  ...repost,
                  post: {
                    ...repost.post,
                    isRepostedByLoggedInUser:
                      !repost.post.isRepostedByLoggedInUser,
                    _count: {
                      ...repost.post._count,
                      reposts: data.isRepostedByUser
                        ? repost.post._count.reposts - 1
                        : repost.post._count.reposts + 1,
                    },
                  },
                }
              : repost;
          });
        }),
      };
    }
  };

  const repostMutation = useMutation({
    mutationFn: toggleRepost,
    onSuccess: () => {
      console.log('Mutation successful, invalidating queries...');
      // Home:
      queryClient.invalidateQueries({ queryKey: ['latestPostsNotFollowed'] });
      queryClient.invalidateQueries({ queryKey: ['latestPostsFollowed'] });
      // Search:
      queryClient.invalidateQueries({ queryKey: ['searchTopPostsPage'] });
      queryClient.invalidateQueries({ queryKey: ['searchLatestPostsPage'] });
      // User:
      queryClient.invalidateQueries({
        queryKey: ['latestUserPosts', userPageId],
      });
      queryClient.invalidateQueries({
        queryKey: ['latestUserPostReplies', userPageId],
      });
      queryClient.invalidateQueries({
        queryKey: ['latestUserMediaPosts', userPageId],
      });
      queryClient.invalidateQueries({
        // the user whose likes page we're currently on i.e. the user who liked the post
        queryKey: ['latestUserLikedPosts', userPageId],
      });
      // currently logged in user's likes page should update after liking some post
      // if logged in user is currently on their own likes page, this should not run to avoid
      // running the same thing twice
      if (userPageId !== currentUserId) {
        queryClient.invalidateQueries({
          // currently logged in user (their likes page)
          queryKey: ['latestUserLikedPosts', currentUserId],
        });
      }

      queryClient.invalidateQueries({
        // creator of the post (their reposts page)
        queryKey: ['latestUserReposts', postUserId],
      });

      queryClient.invalidateQueries({
        // current user (their reposts page)
        queryKey: ['latestUserReposts', currentUserId],
      });

      // e.g. we're on User B's repost page as User A; User B reposted their own post; User A reposts that post
      // the creator of the post and the repost are the same (User B)
      if (repostUserId && postUserId !== repostUserId) {
        queryClient.invalidateQueries({
          // creator of the repost (their reposts page)
          queryKey: ['latestUserReposts', repostUserId],
        });
      }

      // each latestUserReposts query gets triggered if for example User A is on User B's reposts page,
      // they reposted User C's post and User A reposts this post
    },
    onMutate: async (data) => {
      console.log('onMutate called with data:', data);
      await queryClient.cancelQueries({ queryKey: ['latestPostsNotFollowed'] });
      await queryClient.cancelQueries({ queryKey: ['latestPostsFollowed'] });

      await queryClient.cancelQueries({ queryKey: ['searchTopPostsPage'] });
      await queryClient.cancelQueries({ queryKey: ['searchLatestPostsPage'] });

      await queryClient.cancelQueries({
        queryKey: ['latestUserPosts', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserPostReplies', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserMediaPosts', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserLikedPosts', userPageId],
      });
      if (userPageId !== currentUserId) {
        await queryClient.cancelQueries({
          queryKey: ['latestUserLikedPosts', currentUserId],
        });
      }
      await queryClient.cancelQueries({
        queryKey: ['latestUserReposts', postUserId],
      });

      await queryClient.cancelQueries({
        queryKey: ['latestUserReposts', currentUserId],
      });

      if (repostUserId && postUserId !== repostUserId) {
        await queryClient.cancelQueries({
          queryKey: ['latestUserReposts', repostUserId],
        });
      }

      const previousLatestPostsNotFollowed = queryClient.getQueryData<OldPosts>(
        ['latestPostsNotFollowed'],
      );
      const previousLatestPostsFollowed = queryClient.getQueryData<OldPosts>([
        'latestPostsFollowed',
      ]);

      const previousSearchTopPosts = queryClient.getQueryData<OldPosts>([
        'searchTopPostsPage',
        searchId,
      ]);

      const previousSearchLatestPosts = queryClient.getQueryData<OldPosts>([
        'searchLatestPostsPage',
        searchId,
      ]);

      const previousLatestUserPosts = queryClient.getQueryData<OldPosts>([
        'latestUserPosts',
        userPageId,
      ]);
      const previousLatestUserPostReplies = queryClient.getQueryData<OldPosts>([
        'latestUserPostReplies',
        userPageId,
      ]);
      const previousLatestUserMediaPosts = queryClient.getQueryData<OldPosts>([
        'latestUserMediaPosts',
        userPageId,
      ]);
      const previousLatestUserLikedPosts = queryClient.getQueryData<OldPosts>([
        'latestUserLikedPosts',
        userPageId,
      ]);
      const previousLatestLoggedInUserLikedPosts =
        queryClient.getQueryData<OldPosts>([
          'latestUserLikedPosts',
          currentUserId,
        ]);
      const previousLatestPostCreatorReposts =
        queryClient.getQueryData<OldReposts>(['latestUserReposts', postUserId]);
      const previousLatestLoggedInUserReposts =
        queryClient.getQueryData<OldReposts>([
          'latestUserReposts',
          currentUserId,
        ]);
      const previousLatestRepostCreatorReposts =
        queryClient.getQueryData<OldReposts>([
          'latestUserReposts',
          repostUserId,
        ]);

      queryClient.setQueryData(
        ['latestPostsNotFollowed'],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticRepostChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestPostsFollowed'],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticRepostChange(oldPostsData, data);
        },
      );

      if (searchId) {
        queryClient.setQueryData(
          ['searchTopPostsPage', searchId],
          (oldPostsData: OldPosts | undefined) => {
            return handleOptimisticRepostChange(oldPostsData, data);
          },
        );

        queryClient.setQueryData(
          ['searchLatestPostsPage', searchId],
          (oldPostsData: OldPosts | undefined) => {
            return handleOptimisticRepostChange(oldPostsData, data);
          },
        );
      }

      queryClient.setQueryData(
        ['latestUserPosts', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticRepostChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestUserPostReplies', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticRepostChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestUserMediaPosts', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticRepostChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestUserLikedPosts', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticRepostChange(oldPostsData, data);
        },
      );

      if (userPageId !== currentUserId) {
        queryClient.setQueryData(
          ['latestUserLikedPosts', currentUserId],
          (oldPostsData: OldPosts | undefined) => {
            return handleOptimisticRepostChange(oldPostsData, data);
          },
        );
      }

      queryClient.setQueryData(
        ['latestUserReposts', postUserId],
        (oldRepostsData: OldReposts | undefined) => {
          return handleOptimisticRepostChangeUserRepostsPage(
            oldRepostsData,
            data,
          );
        },
      );

      queryClient.setQueryData(
        ['latestUserReposts', currentUserId],
        (oldRepostsData: OldReposts | undefined) => {
          return handleOptimisticRepostChangeUserRepostsPage(oldRepostsData, {
            ...data,
            loggedInUserId: currentUserId,
          });
        },
      );

      if (repostUserId && postUserId !== repostUserId) {
        queryClient.setQueryData(
          ['latestUserReposts', repostUserId],
          (oldRepostsData: OldReposts | undefined) => {
            return handleOptimisticRepostChangeUserRepostsPage(
              oldRepostsData,
              data,
            );
          },
        );
      }

      return {
        previousLatestPostsNotFollowed,
        previousLatestPostsFollowed,
        previousSearchTopPosts,
        previousSearchLatestPosts,
        previousLatestUserPosts,
        previousLatestUserPostReplies,
        previousLatestUserMediaPosts,
        previousLatestUserLikedPosts,
        previousLatestLoggedInUserLikedPosts,
        previousLatestPostCreatorReposts,
        previousLatestRepostCreatorReposts,
        previousLatestLoggedInUserReposts,
      };
    },
    onError: (err, data, context) => {
      console.error('Error occurred:', err);
      queryClient.setQueryData(
        ['latestPostsNotFollowed'],
        context?.previousLatestPostsNotFollowed,
      );
      queryClient.setQueryData(
        ['latestPostsFollowed'],
        context?.previousLatestPostsFollowed,
      );

      if (searchId) {
        queryClient.setQueryData(
          ['searchTopPostsPage', searchId],
          context?.previousSearchTopPosts,
        );
        queryClient.setQueryData(
          ['searchLatestPostsPage', searchId],
          context?.previousSearchLatestPosts,
        );
      }

      queryClient.setQueryData(
        ['latestUserPosts', userPageId],
        context?.previousLatestUserPosts,
      );
      queryClient.setQueryData(
        ['latestUserPostReplies', userPageId],
        context?.previousLatestUserPostReplies,
      );
      queryClient.setQueryData(
        ['latestUserMediaPosts', userPageId],
        context?.previousLatestUserMediaPosts,
      );
      queryClient.setQueryData(
        ['latestUserLikedPosts', userPageId],
        context?.previousLatestUserLikedPosts,
      );
      queryClient.setQueryData(
        ['latestUserLikedPosts', currentUserId],
        context?.previousLatestLoggedInUserLikedPosts,
      );

      queryClient.setQueryData(
        ['latestUserReposts', postUserId],
        context?.previousLatestPostCreatorReposts,
      );
      queryClient.setQueryData(
        ['latestUserReposts', currentUserId],
        context?.previousLatestLoggedInUserReposts,
      );

      if (repostUserId && postUserId !== repostUserId) {
        queryClient.setQueryData(
          ['latestUserReposts', repostUserId],
          context?.previousLatestRepostCreatorReposts,
        );
      }
    },
  });

  const handleOptimisticLikeChange = (
    oldPostsData: OldPosts | undefined,
    data: {
      isLikedByUser: boolean;
      postId: number;
      loggedInUserId?: number | string | null;
    },
  ) => {
    // handle case where oldPosts might be undefined
    // (e.g. User/Likes page wasn't visited, so its query hasn't been defined yet / there's no data)
    if (!oldPostsData) return { pageParams: [0], pages: [[]] };
    // handle case where User A unliked some post; this post should be removed from the User A/Likes
    // page to avoid bugs; this only runs if loggedInUserId was provided to the function
    if (data.loggedInUserId && data.isLikedByUser) {
      return {
        ...oldPostsData,
        pages: oldPostsData.pages.map((oldPostsArray) => {
          return oldPostsArray.filter((post) => post.id !== data.postId);
        }),
      };
      // user A liked some post and it should appear in User A's liked posts page
    } else if (data.loggedInUserId && !data.isLikedByUser) {
      return {
        ...oldPostsData,
        pages: [
          [
            {
              createdAt: time,
              id,
              images,
              isLikedByLoggedInUser: true,
              isRepostedByLoggedInUser,
              replyToPost: replyPost,
              text,
              user,
              // increase likes by 1
              _count: { replies, likes: Number(likes) + 1, reposts },
            },
          ],
          ...oldPostsData.pages,
        ],
      };
    }
    // if loggedInUserId wasn't provided to the function, just increase / decrease the likes count
    // applicable to the majority of queryKeys (e.g. User A liking a post in the home page)
    return {
      ...oldPostsData,
      pages: oldPostsData.pages.map((oldPostsArray) => {
        return oldPostsArray.map((post) => {
          return post.id === data.postId
            ? {
                ...post,
                isLikedByLoggedInUser: !post.isLikedByLoggedInUser,
                _count: {
                  ...post._count,
                  likes: data.isLikedByUser
                    ? post._count.likes - 1
                    : post._count.likes + 1,
                },
              }
            : post;
        });
      }),
    };
  };

  const handleOptimisticLikeChangeUserRepostsPage = (
    oldRepostsData: OldReposts | undefined,
    data: {
      isLikedByUser: boolean;
      postId: number;
    },
  ) => {
    if (!oldRepostsData) return { pageParams: [0], pages: [[]] };
    return {
      ...oldRepostsData,
      pages: oldRepostsData.pages.map((oldRepostsArray) => {
        return oldRepostsArray.map((repost) => {
          return repost.post.id === data.postId
            ? {
                ...repost,
                post: {
                  ...repost.post,
                  isLikedByLoggedInUser: !repost.post.isLikedByLoggedInUser,
                  _count: {
                    ...repost.post._count,
                    likes: data.isLikedByUser
                      ? repost.post._count.likes - 1
                      : repost.post._count.likes + 1,
                  },
                },
              }
            : repost;
        });
      }),
    };
  };

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      // Home:
      queryClient.invalidateQueries({ queryKey: ['latestPostsNotFollowed'] });
      queryClient.invalidateQueries({ queryKey: ['latestPostsFollowed'] });
      // Search:
      queryClient.invalidateQueries({ queryKey: ['searchTopPostsPage'] });
      queryClient.invalidateQueries({ queryKey: ['searchLatestPostsPage'] });
      // User:
      queryClient.invalidateQueries({
        queryKey: ['latestUserPosts', userPageId],
      });
      queryClient.invalidateQueries({
        queryKey: ['latestUserPostReplies', userPageId],
      });
      queryClient.invalidateQueries({
        queryKey: ['latestUserMediaPosts', userPageId],
      });
      queryClient.invalidateQueries({
        // the user whose likes page we're currently on i.e. the user who liked the post
        queryKey: ['latestUserLikedPosts', userPageId],
      });
      queryClient.invalidateQueries({
        // curent user's liked posts page
        queryKey: ['latestUserLikedPosts', currentUserId],
      });
      queryClient.invalidateQueries({
        // creator of the post (their reposts page)
        queryKey: ['latestUserReposts', postUserId],
      });
      if (postUserId !== currentUserId) {
        queryClient.invalidateQueries({
          // current user (their reposts page)
          queryKey: ['latestUserReposts', currentUserId],
        });
      }

      if (
        repostUserId &&
        postUserId !== repostUserId &&
        currentUserId !== repostUserId
      ) {
        queryClient.invalidateQueries({
          queryKey: ['latestUserReposts', repostUserId], // creator of the repost (their reposts page)
        });
      }
    },
    onMutate: async (data) => {
      console.log('Like mutation: onMutate called with data:', data);
      await queryClient.cancelQueries({ queryKey: ['latestPostsNotFollowed'] });
      await queryClient.cancelQueries({ queryKey: ['latestPostsFollowed'] });

      await queryClient.cancelQueries({ queryKey: ['searchTopPostsPage'] });
      await queryClient.cancelQueries({ queryKey: ['searchLatestPostsPage'] });

      await queryClient.cancelQueries({
        queryKey: ['latestUserPosts', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserPostReplies', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserMediaPosts', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserLikedPosts', userPageId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserLikedPosts', currentUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['latestUserReposts', postUserId],
      });

      if (postUserId !== currentUserId) {
        await queryClient.cancelQueries({
          queryKey: ['latestUserReposts', currentUserId],
        });
      }

      if (
        repostUserId &&
        postUserId !== repostUserId &&
        currentUserId !== repostUserId
      ) {
        await queryClient.cancelQueries({
          queryKey: ['latestUserReposts', repostUserId],
        });
      }

      const previousLatestPostsNotFollowed = queryClient.getQueryData<OldPosts>(
        ['latestPostsNotFollowed'],
      );
      const previousLatestPostsFollowed = queryClient.getQueryData<OldPosts>([
        'latestPostsFollowed',
      ]);

      const previousSearchTopPosts = queryClient.getQueryData<OldPosts>([
        'searchTopPostsPage',
        searchId,
      ]);

      const previousSearchLatestPosts = queryClient.getQueryData<OldPosts>([
        'searchLatestPostsPage',
        searchId,
      ]);

      const previousLatestUserPosts = queryClient.getQueryData<OldPosts>([
        'latestUserPosts',
        userPageId,
      ]);
      const previousLatestUserPostReplies = queryClient.getQueryData<OldPosts>([
        'latestUserPostReplies',
        userPageId,
      ]);
      const previousLatestUserMediaPosts = queryClient.getQueryData<OldPosts>([
        'latestUserMediaPosts',
        userPageId,
      ]);
      const previousLatestUserLikedPosts = queryClient.getQueryData<OldPosts>([
        'latestUserLikedPosts',
        userPageId,
      ]);
      const previousLatestLoggedInUserLikedPosts =
        queryClient.getQueryData<OldPosts>([
          'latestUserLikedPosts',
          currentUserId,
        ]);
      const previousLatestPostCreatorReposts =
        queryClient.getQueryData<OldReposts>(['latestUserReposts', postUserId]);
      const previousLatestLoggedInUserReposts =
        queryClient.getQueryData<OldReposts>([
          'latestUserReposts',
          currentUserId,
        ]);
      const previousLatestRepostCreatorReposts =
        queryClient.getQueryData<OldReposts>([
          'latestUserReposts',
          repostUserId,
        ]);

      queryClient.setQueryData(
        ['latestPostsNotFollowed'],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestPostsFollowed'],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, data);
        },
      );

      if (searchId) {
        queryClient.setQueryData(
          ['searchTopPostsPage', searchId],
          (oldPostsData: OldPosts | undefined) => {
            return handleOptimisticLikeChange(oldPostsData, data);
          },
        );

        queryClient.setQueryData(
          ['searchLatestPostsPage', searchId],
          (oldPostsData: OldPosts | undefined) => {
            return handleOptimisticLikeChange(oldPostsData, data);
          },
        );
      }

      queryClient.setQueryData(
        ['latestUserPosts', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestUserPostReplies', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestUserMediaPosts', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, data);
        },
      );

      queryClient.setQueryData(
        ['latestUserLikedPosts', userPageId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, data);
        },
      );

      // this one gets additional loggedInUserId property to handle the scenario with
      // removing / adding liked post
      queryClient.setQueryData(
        ['latestUserLikedPosts', currentUserId],
        (oldPostsData: OldPosts | undefined) => {
          return handleOptimisticLikeChange(oldPostsData, {
            ...data,
            loggedInUserId: currentUserId,
          });
        },
      );

      // reposts page
      queryClient.setQueryData(
        ['latestUserReposts', postUserId],
        (oldRepostsData: OldReposts | undefined) => {
          return handleOptimisticLikeChangeUserRepostsPage(
            oldRepostsData,
            data,
          );
        },
      );

      if (postUserId !== currentUserId) {
        queryClient.setQueryData(
          ['latestUserReposts', currentUserId],
          (oldRepostsData: OldReposts | undefined) => {
            return handleOptimisticLikeChangeUserRepostsPage(
              oldRepostsData,
              data,
            );
          },
        );
      }

      if (
        repostUserId &&
        postUserId !== repostUserId &&
        currentUserId !== repostUserId
      ) {
        queryClient.setQueryData(
          ['latestUserReposts', repostUserId],
          (oldRepostsData: OldReposts | undefined) => {
            return handleOptimisticLikeChangeUserRepostsPage(
              oldRepostsData,
              data,
            );
          },
        );
      }

      return {
        previousLatestPostsNotFollowed,
        previousLatestPostsFollowed,
        previousSearchTopPosts,
        previousSearchLatestPosts,
        previousLatestUserPosts,
        previousLatestUserPostReplies,
        previousLatestUserMediaPosts,
        previousLatestUserLikedPosts,
        previousLatestLoggedInUserLikedPosts,
        previousLatestPostCreatorReposts,
        previousLatestRepostCreatorReposts,
        previousLatestLoggedInUserReposts,
      };
    },
    onError: (err, data, context) => {
      console.error('Error occurred:', err);
      queryClient.setQueryData(
        ['latestPostsNotFollowed'],
        context?.previousLatestPostsNotFollowed,
      );
      queryClient.setQueryData(
        ['latestPostsFollowed'],
        context?.previousLatestPostsFollowed,
      );

      if (searchId) {
        queryClient.setQueryData(
          ['searchTopPostsPage', searchId],
          context?.previousSearchTopPosts,
        );
        queryClient.setQueryData(
          ['searchLatestPostsPage', searchId],
          context?.previousSearchLatestPosts,
        );
      }

      queryClient.setQueryData(
        ['latestUserPosts', userPageId],
        context?.previousLatestUserPosts,
      );
      queryClient.setQueryData(
        ['latestUserPostReplies', userPageId],
        context?.previousLatestUserPostReplies,
      );
      queryClient.setQueryData(
        ['latestUserMediaPosts', userPageId],
        context?.previousLatestUserMediaPosts,
      );
      queryClient.setQueryData(
        ['latestUserLikedPosts', userPageId],
        context?.previousLatestUserLikedPosts,
      );
      queryClient.setQueryData(
        ['latestUserLikedPosts', currentUserId],
        context?.previousLatestLoggedInUserLikedPosts,
      );
      queryClient.setQueryData(
        ['latestUserReposts', postUserId],
        context?.previousLatestPostCreatorReposts,
      );

      if (postUserId !== currentUserId) {
        queryClient.setQueryData(
          ['latestUserReposts', currentUserId],
          context?.previousLatestLoggedInUserReposts,
        );
      }

      if (repostUserId && postUserId !== repostUserId) {
        queryClient.setQueryData(
          ['latestUserReposts', repostUserId],
          context?.previousLatestRepostCreatorReposts,
        );
      }
    },
  });

  const handleRepostClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    repostMutation.mutate({
      isRepostedByUser: isRepostedByLoggedInUser,
      postId: id,
    });
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    likeMutation.mutate({
      isLikedByUser: isLikedByLoggedInUser,
      postId: id,
    });
  };

  return (
    <>
      <div
        onClick={handlePostClick}
        className='relative flex cursor-pointer flex-col gap-2 border-b-2 border-b-[#212835] px-4 pt-4 pb-2 hover:bg-[#1d232e]'
      >
        {/* relative above needed to position the PostClipboard component */}
        {repostedBy && (
          <div className='flex items-center gap-1 overflow-hidden font-bold text-white'>
            <FaRetweet />
            <p className='truncate'>Reposted by {repostedBy}</p>
          </div>
        )}
        <div className='flex gap-2'>
          <div
            onClick={handleUserClick}
            className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-3xl'
          >
            {user.userAvatar ? (
              <img src={user.userAvatar} className='h-12 w-12 rounded-full' />
            ) : (
              <FaUser />
            )}
          </div>
          <div className='flex w-full flex-col gap-1 overflow-hidden'>
            <div className='flex flex-wrap gap-1.5 truncate'>
              <div
                onClick={handleUserClick}
                className='font-bold text-white hover:underline'
              >
                {user.userName}
              </div>
              <div
                onClick={handleUserClick}
                className='truncate text-slate-500'
              >
                @{user.userHandle}
              </div>
              <div className='text-slate-500'>·</div>
              <div className='group'>
                <div className='text-slate-500'>{postDate()}</div>
                {/* if it's not hidden for mobile screens it will overflow */}
                <span className='absolute mt-2 transform rounded-2xl bg-[#15181f] px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-0 max-sm:hidden'>
                  {format(time, "MMMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
            <div className='text-white'>{text}</div>
            {images && images.length > 0 && (
              <PostImages images={images} selectImg={selectImg} />
            )}
            {replyPost && (
              <ReplyToPost
                key={replyPost.id}
                id={replyPost.id}
                user={replyPost.user}
                createdAt={replyPost.createdAt}
                text={replyPost?.text}
                images={replyPost.images}
              />
            )}
            <div className='flex items-center justify-between text-slate-500 select-none'>
              <div className='flex cursor-pointer items-center gap-1 rounded-full p-1 hover:bg-[#262d3b]'>
                <FaRegCommentAlt />
                <div>{replies}</div>
              </div>
              <div
                className={`${isRepostedByLoggedInUser && 'text-green-500'} flex cursor-pointer items-center gap-1 rounded-full p-1 hover:bg-[#262d3b]`}
                onClick={handleRepostClick}
              >
                <FaRetweet />
                <div>{reposts}</div>
              </div>
              <div
                className={`${isLikedByLoggedInUser && 'text-blue-400'} flex cursor-pointer items-center gap-1 rounded-full p-1 hover:bg-[#262d3b]`}
                onClick={handleLikeClick}
              >
                <FaRegHeart />
                <div>{likes}</div>
              </div>
              <BsThreeDots
                className='h-full w-8 cursor-pointer rounded-full p-1 hover:bg-[#262d3b]'
                onClick={toggleDotsModal}
              />
              <PostClipboard
                addDataToClipboard={addDataToClipboard}
                isOpen={isDotsModalOpen}
                onClose={() => setIsDotsModalOpen(!isDotsModalOpen)}
                text={text}
                link={`${domain}/post/${id}`}
                isReplyPost={replyPost ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
      {images && imagesModal !== null && (
        <ImageModal
          images={images}
          imgArrayPosition={imagesModal}
          closeModal={() => setImagesModal(null)}
        />
      )}
    </>
  );
}
