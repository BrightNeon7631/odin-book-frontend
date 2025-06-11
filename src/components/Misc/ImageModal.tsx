import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
  IoIosCloseCircle,
} from 'react-icons/io';
import { useState } from 'react';

type ImageModalProps = {
  closeModal: (
    e:
      | React.MouseEvent<SVGElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  imgArrayPosition: number;
  images: string[];
};

export default function ImageModal({
  closeModal,
  images,
  imgArrayPosition,
}: ImageModalProps) {
  const [currentImage, setCurrentImage] = useState(imgArrayPosition);

  if (
    currentImage === null ||
    currentImage === undefined ||
    images[currentImage] === undefined
  )
    return null;

  const previousImg = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    setCurrentImage((prevState) => prevState - 1);
  };

  const nextImg = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    setCurrentImage((prevState) => prevState + 1);
  };

  return (
    <div className='fixed inset-0 z-50 flex max-h-full items-center justify-center select-none'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={closeModal}
      ></div>
      <img
        src={images[currentImage]}
        className='z-10 max-h-[85vh] max-w-full object-contain'
        onClick={(e) => e.stopPropagation()}
      />
      {currentImage !== 0 && (
        <IoIosArrowDropleftCircle
          className='absolute top-1/2 left-5 z-20 -translate-y-1/2 transform cursor-pointer text-5xl text-white'
          onClick={previousImg}
        />
      )}
      {currentImage + 1 < images.length && (
        <IoIosArrowDroprightCircle
          className='absolute top-1/2 right-5 z-20 -translate-y-1/2 transform cursor-pointer text-5xl text-white'
          onClick={nextImg}
        />
      )}
      <IoIosCloseCircle
        className='absolute top-5 right-5 z-20 cursor-pointer text-4xl text-white'
        onClick={closeModal}
      />
    </div>
  );
}
