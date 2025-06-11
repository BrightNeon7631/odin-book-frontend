import { useInView } from 'react-intersection-observer';

type InfiniteScrollContainerProps = {
  children: React.ReactNode;
  onPageBottomReached: () => void;
  className?: string;
};

export default function InfiniteScrollContainer({
  children,
  onPageBottomReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    // this adds a margin around the ref div element, so the data is loaded a litle bit earlier, not when on screen
    rootMargin: '50px',
    onChange(inView) {
      // inView tells if ref div is visible on the page or not (including the root margin)
      if (inView) {
        // if visable - load more data etc.
        onPageBottomReached();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
