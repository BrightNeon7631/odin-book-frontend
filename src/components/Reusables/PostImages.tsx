type PostImagesProps = {
  images: string[];
  selectImg: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    imgArrayPosition: number,
  ) => void;
};

export default function PostImages({ images, selectImg }: PostImagesProps) {
  const newImages = images.slice(0, 4);
  return (
    <div
      className={`grid gap-1.5 rounded-xl border-2 border-[#212835] ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}
    >
      {newImages.map((img, index) => {
        return (
          // first image should take two rows if there are three images in total
          <div
            key={index}
            className={`relative rounded-md bg-black ${index === 0 && images.length === 3 ? 'row-span-2' : ''}`}
            onClick={(e) => selectImg(e, index)}
          >
            <img
              src={img}
              className={`aspect-[1.5/1] rounded-md object-cover ${index === 3 && images.length !== index + 1 ? 'opacity-50 blur-[2px]' : ''} ${index === 0 && images.length === 3 ? 'h-full' : ''}`}
            />
            {index === 3 && images.length !== index + 1 && (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-4xl font-bold text-white'>
                +{images.length - 4}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
