import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { type UserSearch, type UserPublic } from '../../../types';
import { fakeLoading } from '../../utils/mockData';
import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';

type SearchUserCardProps = {
  userId: number | string;
  userAvatar?: string | null;
  userName?: string | null;
  userHandle?: string | null;
  about?: string | null;
  isFollowedByLoggedInUser: boolean;
  searchPhrase?: string;
};

type OldSearchUserData = {
  pageParams: number[];
  pages: UserSearch[][];
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

export default function SearchUserCard({
  userId,
  about,
  userAvatar,
  userHandle,
  userName,
  isFollowedByLoggedInUser,
  searchPhrase,
}: SearchUserCardProps) {
  const queryClient = useQueryClient();
  const userIdString = userId.toString();
  const navigate = useNavigate();

  const handleOptimisticFollowChange = (
    oldSearchUserData: OldSearchUserData | undefined,
    data: { isFollowedByUser: boolean; userId: number | string },
  ) => {
    if (!oldSearchUserData) return { pageParams: [0], pages: [[]] };
    return {
      ...oldSearchUserData,
      pages: oldSearchUserData.pages.map((oldUsersArray) => {
        return oldUsersArray.map((user) => {
          return user.id === data.userId
            ? {
                ...user,
                isFollowedByLoggedInUser: !data.isFollowedByUser,
              }
            : user;
        });
      }),
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
      await queryClient.cancelQueries({
        queryKey: ['searchUsersPage', searchPhrase],
      });
      const previousSearchUsers = queryClient.getQueryData<UserPublic>([
        'searchUsersPage',
        searchPhrase,
      ]);
      queryClient.setQueryData(
        ['searchUsersPage', searchPhrase],
        (oldSearchUserData: OldSearchUserData | undefined) => {
          return handleOptimisticFollowChange(oldSearchUserData, data);
        },
      );
      return {
        previousSearchUsers,
      };
    },
    onError: (err, data, context) => {
      queryClient.setQueryData(
        ['searchUsersPage', searchPhrase],
        context?.previousSearchUsers,
      );
    },
  });

  const handleUserClick = () => {
    navigate(`/app/user/${userId}`);
  };

  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    mutate({ isFollowedByUser: isFollowedByLoggedInUser, userId })
  };

  return (
    <div
      onClick={handleUserClick}
      className='flex flex-col gap-4 truncate border-b-2 border-b-[#212835] p-3 px-4 pt-4 pb-2 hover:bg-[#1d232e] cursor-pointer'
    >
      <div className='flex justify-between'>
        <div className='flex gap-4'>
          <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-3xl select-none'>
            {userAvatar ? (
              <img src={userAvatar} className='h-12 w-12 rounded-full' />
            ) : (
              <FaUser />
            )}
          </div>
          <div className='flex flex-col gap-0.5'>
            <div className='font-bold text-white'>{userName}</div>
            <div className='text-slate-500'>@{userHandle}</div>
          </div>
        </div>
        <button
          className={`mt-1 mr-3 flex h-10 cursor-pointer items-center gap-2 self-end rounded-3xl px-3 py-2 text-white hover:opacity-80 ${isFollowedByLoggedInUser ? 'bg-gray-500' : 'bg-blue-600'}`}
          onClick={handleFollowClick}
        >
          <span className='text-2xl'>
            {isFollowedByLoggedInUser ? '-' : '+'}
          </span>
          <span className='font-bold'>
            {isFollowedByLoggedInUser ? 'Unfollow' : 'Follow'}
          </span>
        </button>
      </div>
      <p className='text-white'>{about}</p>
    </div>
  );
}
