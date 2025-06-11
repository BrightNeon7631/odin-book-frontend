import { NavLink, useLocation, Outlet, useParams } from 'react-router-dom';
import UserPage from '../Reusables/UserPage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type UserPublic } from '../../../types';
import { fakeLoading } from '../../utils/mockData';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const getUser = async (id: number | string) => {
  const res = await axios.get<UserPublic>(`/user/${id}`);
  await fakeLoading(1000);
  return res.data;
};

export default function UserLayout() {
  const path = useLocation()?.pathname;
  const params = useParams<{ id?: string }>();
  const paramsId = params.id;

  const { data, isPending, error } = useQuery({
    queryKey: ['userPage', paramsId],
    queryFn: () => {
      if (!paramsId) {
        throw new Error('ID is required.');
      }
      return getUser(paramsId);
    },
    // only run the query if id is defined
    enabled: !!paramsId,
  });

  return (
    <div className='relative w-full md:w-xl md:border-2 md:border-[#212835]'>
      {isPending && (
        <AiOutlineLoading3Quarters className='m-4 mx-auto animate-spin text-4xl text-slate-500' />
      )}

      {error && (
        <div className='mt-4 mb-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          Error fetching data: {error?.message}
        </div>
      )}

      {data && (
        <>
          <UserPage
            userId={data.id}
            userName={data?.userName}
            userHandle={data?.userHandle}
            userDescription={data?.about}
            userAvatar={data?.userAvatar}
            userImage={data?.userImage}
            noOfFollowers={data?._count.userFollowers}
            noOfFollowing={data?._count.userFollowing}
            noOfPosts={data?._count.posts}
            isFollowedByLoggedInUser={data?.isFollowedByLoggedInUser}
          />

          <div className='relative flex justify-around border-b-2 border-b-[#212835] p-4 font-bold text-slate-500'>
            <NavLink
              className='hover:text-slate-100 aria-[current=page]:text-slate-100'
              to={`${paramsId}`}
              end
            >
              <div>Posts</div>
              <span
                className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
                  path === `/app/user/${paramsId}`
                    ? 'bottom-[-1px] w-11'
                    : 'hidden'
                }`}
              />
            </NavLink>
            <NavLink
              className='hover:text-slate-100 aria-[current=page]:text-slate-100'
              to={`/app/user/${paramsId}/replies`}
            >
              <div>Replies</div>
              <span
                className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
                  path === `/app/user/${paramsId}/replies`
                    ? 'bottom-[-1px] w-14'
                    : 'hidden'
                }`}
              />
            </NavLink>
            <NavLink
              className='hover:text-slate-100 aria-[current=page]:text-slate-100'
              to={`/app/user/${paramsId}/reposts`}
            >
              <div>Reposts</div>
              <span
                className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
                  path === `/app/user/${paramsId}/reposts`
                    ? 'bottom-[-1px] w-16'
                    : 'hidden'
                }`}
              />
            </NavLink>
            <NavLink
              className='hover:text-slate-100 aria-[current=page]:text-slate-100'
              to={`/app/user/${paramsId}/likes`}
            >
              <div>Likes</div>
              <span
                className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
                  path === `/app/user/${paramsId}/likes`
                    ? 'bottom-[-1px] w-10'
                    : 'hidden'
                }`}
              />
            </NavLink>
            <NavLink
              className='hover:text-slate-100 aria-[current=page]:text-slate-100'
              to={`/app/user/${paramsId}/media`}
            >
              <div>Media</div>
              <span
                className={`absolute h-1 bg-blue-500 transition-all duration-300 ${
                  path === `/app/user/${paramsId}/media`
                    ? 'bottom-[-1px] w-12'
                    : 'hidden'
                }`}
              />
            </NavLink>
          </div>
          <Outlet context={{ userId: paramsId }} />
        </>
      )}
    </div>
  );
}
