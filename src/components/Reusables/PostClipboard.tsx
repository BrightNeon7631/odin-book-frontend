import { TbClipboard } from 'react-icons/tb';
import { FiUpload } from 'react-icons/fi';
import { useRef, useEffect } from 'react';

type PostClipboardProps = {
  isOpen: boolean;
  onClose: () => void;
  addDataToClipboard: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: string | undefined | null,
  ) => void;
  text: string | null | undefined;
  link: string;
  isReplyPost: boolean;
};

export default function PostClipboard({
  addDataToClipboard,
  isOpen,
  onClose,
  text,
  link,
  isReplyPost,
}: PostClipboardProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // prevent scrolling
    } else {
      document.body.style.overflow = 'unset'; // allow scrolling
    }
    // clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 z-50 mt-2 flex transform cursor-auto flex-col gap-2 rounded-xl border-2 border-[#212835] bg-[#15181f] p-2 font-bold whitespace-nowrap text-white select-none ${isReplyPost ? '-bottom-24' : 'top-24'}`}
      ref={modalRef}
    >
      <div
        className='flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 hover:bg-[#202633]'
        onClick={(e) => addDataToClipboard(e, text)}
      >
        <div>Copy post text</div>
        <TbClipboard className='text-xl' />
      </div>
      <div
        className='flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 hover:bg-[#202633]'
        onClick={(e) => addDataToClipboard(e, link)}
      >
        <div>Copy post link</div>
        <FiUpload className='text-xl' />
      </div>
    </div>
  );
}
