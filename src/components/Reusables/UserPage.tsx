import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { useAuth } from '../../provider/authProvider';
import { type AuthContextType, type UserPublic } from '../../../types';
import { fakeLoading } from '../../utils/mockData';
import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';

type UserPageProps = {
  userId: string | number;
  userName: string;
  userHandle: string;
  userAvatar?: string | null;
  userImage?: string | null;
  userDescription?: string | null;
  noOfFollowers: string | number;
  noOfFollowing: string | number;
  noOfPosts: string | number;
  isFollowedByLoggedInUser: boolean;
};

const toggleFollow = async ({
  isFollowedByUser,
  userId,
}: {
  isFollowedByUser: boolean;
  userId: number | string;
}) => {
  if (isFollowedByUser) {
    await fakeLoading(2000);
    await axios.delete(`/user/follow/${userId}`);
  } else {
    await fakeLoading(2000);
    await axios.post(`/user/follow/${userId}`);
  }
};

export default function UserPage({
  userId,
  noOfFollowers,
  noOfFollowing,
  noOfPosts,
  userAvatar,
  userDescription,
  userHandle,
  userImage,
  userName,
  isFollowedByLoggedInUser,
}: UserPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth() as AuthContextType; // logged in user
  const queryClient = useQueryClient();
  const userIdString = userId.toString();

  const handleOptimisticFollowChangeUserPage = (
    oldUserPageData: UserPublic | undefined,
    data: { isFollowedByUser: boolean },
  ) => {
    return {
      ...oldUserPageData,
      isFollowedByLoggedInUser: !data.isFollowedByUser,
    };
  };

  const { mutate } = useMutation({
    mutationFn: toggleFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPage', userIdString] });
      queryClient.invalidateQueries({ queryKey: ['searchUsersPage'] });
      queryClient.invalidateQueries({ queryKey: ['latestPostsNotFollowed'] });
      queryClient.invalidateQueries({ queryKey: ['latestPostsFollowed'] });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['userPage', userIdString] });
      const previousUserPage = queryClient.getQueryData<UserPublic>([
        'userPage',
        userIdString,
      ]);
      queryClient.setQueryData(
        ['userPage', userIdString],
        (oldUserPageData: UserPublic | undefined) => {
          return handleOptimisticFollowChangeUserPage(oldUserPageData, data);
        },
      );
      return {
        previousUserPage,
      };
    },
    onError: (err, data, context) => {
      queryClient.setQueryData(
        ['userPage', userIdString],
        context?.previousUserPage,
      );
    },
  });

  return (
    <div className='flex flex-col gap-1 text-white'>
      <div className='relative h-38'>
        {userImage ? (
          <img src={userImage} className='h-full w-full object-cover' />
        ) : (
          <div className='h-full w-full bg-gray-300 object-cover'></div>
        )}
        {/* navigate(-1) allows to go back to the previous page */}
        <div
          className='absolute top-2 left-2 cursor-pointer text-3xl text-gray-600'
          onClick={() => navigate(-1)}
        >
          <BsArrowLeftCircleFill />
        </div>
      </div>
      <div className='absolute top-26 ml-3 flex h-23 w-23 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#181d27] bg-slate-300 text-3xl'>
        {userAvatar ? (
          <img src={userAvatar} className='h-23 w-23 rounded-full' />
        ) : (
          <FaUser />
        )}
      </div>
      {userId != user?.id && (
        <button
          className={`mt-1 mr-3 flex h-10 cursor-pointer items-center gap-2 self-end rounded-3xl px-3 py-2 text-white hover:opacity-80 ${isFollowedByLoggedInUser ? 'bg-gray-500' : 'bg-blue-600'}`}
          onClick={() =>
            mutate({ isFollowedByUser: isFollowedByLoggedInUser, userId })
          }
        >
          <span className='text-2xl'>
            {isFollowedByLoggedInUser ? '-' : '+'}
          </span>
          <span className='font-bold'>
            {isFollowedByLoggedInUser ? 'Unfollow' : 'Follow'}
          </span>
        </button>
      )}
      <div
        className={`flex flex-col gap-1.5 px-3 pb-2 ${userId == user?.id ? 'mt-12' : ''}`}
      >
        <div>
          <h1 className='text-3xl font-bold'>{userName}</h1>
          <div className='truncate text-slate-400'>@{userHandle}</div>
        </div>
        <div className='flex gap-2'>
          <div className='flex gap-1'>
            <div className='font-bold'>{noOfFollowers}</div>
            <div className='text-slate-400'>followers</div>
          </div>
          <div className='flex gap-1'>
            <div className='font-bold'>{noOfFollowing}</div>
            <div className='text-slate-400'>following</div>
          </div>
          <div className='flex gap-1'>
            <div className='font-bold'>{noOfPosts}</div>
            <div className='text-slate-400'>posts</div>
          </div>
        </div>
        <div>{userDescription}</div>
      </div>
    </div>
  );
}
