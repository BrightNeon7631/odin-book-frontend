import { FaUser } from 'react-icons/fa6';
import { addYears, format, formatDistanceToNow, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../Misc/ImageModal';
import PostImages from './PostImages';
import { type User } from './Post';

export type ReplyToPostTypes = {
  id: number | string;
  createdAt: Date;
  text?: string | null;
  images?: string[];
  user: User;
};

export default function ReplyToPost({
  id,
  user,
  createdAt,
  text,
  images,
}: ReplyToPostTypes) {
  const navigate = useNavigate();
  const [modal, setModal] = useState<number | null>(null);

  const handlePostClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/app/post/${id}`);
  };

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/app/user/${user.id}`);
  };

  const selectImg = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    imgArrayPosition: number,
  ) => {
    e.stopPropagation();
    setModal(imgArrayPosition);
  };

  const closeModal = (
    e:
      | React.MouseEvent<SVGElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setModal(null);
  };

  const postDate = () => {
    const currentDate = new Date();
    const postDateAfter1Y = addYears(createdAt, 1);
    const isPostAfter1Y = isAfter(currentDate, postDateAfter1Y);

    if (isPostAfter1Y) {
      return format(createdAt, 'dd/MM/yyyy');
    } else {
      return `${formatDistanceToNow(createdAt, {
        addSuffix: true,
      })}`;
    }
  };

  return (
    <>
      <div
        onClick={(e) => handlePostClick(e)}
        className='flex gap-2 rounded-xl border-2 border-[#212835] px-4 pt-4 pb-2 hover:bg-[#202633]'
      >
        <div className='flex flex-col gap-1'>
          <div className='flex flex-wrap gap-1.5 truncate'>
            <div
              onClick={handleUserClick}
              className='text-md flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-300'
            >
              {user.userAvatar ? (
                <img src={user.userAvatar} className='h-6 w-6 rounded-full' />
              ) : (
                <FaUser />
              )}
            </div>
            <div
              onClick={handleUserClick}
              className='font-bold text-white hover:underline'
            >
              {user.userName}
            </div>
            <div onClick={handleUserClick} className='text-slate-500'>
              @{user.userHandle}
            </div>
            <div className='text-slate-500'>·</div>
            <div className='group'>
              <div className='text-slate-500'>{postDate()}</div>
              <span className='absolute mt-2 transform rounded-2xl bg-[#15181f] px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-0 max-sm:hidden'>
                {format(createdAt, "MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
          <div className='text-white'>{text}</div>
          {images && images.length > 0 && (
            <PostImages images={images} selectImg={selectImg} />
          )}
        </div>
      </div>
      {images && modal !== null && (
        <ImageModal
          images={images}
          imgArrayPosition={modal}
          closeModal={closeModal}
        />
      )}
    </>
  );
}
