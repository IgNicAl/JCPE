import React, { useRef, useState, useEffect } from 'react';

export type TagItem = {
  id: string;
  label: string;
  imageUrl: string;
};

type TagCarouselProps = {
  tags: TagItem[];
};

const scrollContainerClasses =
  'Tags absolute inset-0 flex gap-6 overflow-x-auto px-4 py-3 items-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab';

const tagTextClasses =
  "relative text-center text-white text-base font-medium font-['Roboto'] capitalize [text-shadow:_0px_0px_2px_rgb(0_0_0_/_0.40)]";

const arrowButtonClasses =
  'absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 text-stone-700 shadow-lg transition hover:text-blue-600 z-10';

const TagCarousel: React.FC<TagCarouselProps> = ({ tags }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(true);

  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleScrollUpdate = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setCanGoLeft(scrollLeft > 0);
    setCanGoRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const step = direction === 'right' ? 220 : -220;
    containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const timer = setTimeout(handleScrollUpdate, 50);

    node.addEventListener('scroll', handleScrollUpdate);
    window.addEventListener('resize', handleScrollUpdate);

    const onMouseDown = (e: MouseEvent) => {
      isDownRef.current = true;
      node.style.cursor = 'grabbing';
      node.style.userSelect = 'none';
      startXRef.current = e.pageX - node.offsetLeft;
      scrollLeftRef.current = node.scrollLeft;
    };

    const onMouseLeave = () => {
      isDownRef.current = false;
      node.style.cursor = 'grab';
      node.style.userSelect = 'auto';
    };

    const onMouseUp = () => {
      isDownRef.current = false;
      node.style.cursor = 'grab';
      node.style.userSelect = 'auto';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;
      e.preventDefault();
      const x = e.pageX - node.offsetLeft;
      const walk = (x - startXRef.current) * 1.5;
      node.scrollLeft = scrollLeftRef.current - walk;
    };

    node.addEventListener('mousedown', onMouseDown as EventListener);
    node.addEventListener('mouseleave', onMouseLeave as EventListener);
    node.addEventListener('mouseup', onMouseUp as EventListener);
    node.addEventListener('mousemove', onMouseMove as EventListener);

    return () => {
      clearTimeout(timer);
      node.removeEventListener('scroll', handleScrollUpdate);
      window.removeEventListener('resize', handleScrollUpdate);

      node.removeEventListener('mousedown', onMouseDown as EventListener);
      node.removeEventListener('mouseleave', onMouseLeave as EventListener);
      node.removeEventListener('mouseup', onMouseUp as EventListener);
      node.removeEventListener('mousemove', onMouseMove as EventListener);
    };
  }, [tags.length]);

  return (
    <div
      data-layer="top-tags"
      className="TopTags w-full max-w-[1512px] h-16 relative"
    >
      <div
        data-layer="Rectangle 2"
        className="Rectangle2 w-full h-16 left-0 top-0 absolute bg-neutral-100 rounded-xl"
      />

      <div
        ref={containerRef}
        data-layer="tags"
        className={scrollContainerClasses}
        aria-label="Lista de tags"
      >
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            data-layer="Hashtag"
            className="Hashtag w-44 h-12 relative rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center transition hover:-translate-y-0.5"
            aria-label={`Tag ${tag.label}`}
            onDragStart={(e) => e.preventDefault()}
          >
            <img
              src={tag.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-[2.50px]"
              aria-hidden="true"
              onDragStart={(e) => e.preventDefault()}
            />
            <div
              className="w-44 h-12 left-0 top-0 absolute bg-black/20"
              aria-hidden="true"
            />

            <span className={tagTextClasses}>{tag.label}</span>
          </button>
        ))}
      </div>

      {canGoLeft && (
        <div
          id="gradient-left"
          className="pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-neutral-100 from-50% via-neutral-100/40 to-transparent rounded-l-xl z-10"
        />
      )}

      {canGoRight && (
        <div
          id="gradient-right"
          data-layer="background"
          className="pointer-events-none Background w-36 h-16 inset-y-0 right-0 top-0 absolute bg-gradient-to-l from-neutral-100 from-50% via-neutral-100/40 to-transparent rounded-r-xl z-10"
        />
      )}

      {canGoLeft && (
        <button
          id="btn-left"
          type="button"
          onClick={() => handleScroll('left')}
          className={`${arrowButtonClasses} left-3`}
          aria-label="Ver tags anteriores"
        >
          <i className="fa-solid fa-chevron-left text-lg" />
        </button>
      )}

      {canGoRight && (
        <button
          id="btn-right"
          type="button"
          onClick={() => handleScroll('right')}
          className={`${arrowButtonClasses} right-3`}
          aria-label="Ver mais tags"
        >
          <i className="fa-solid fa-chevron-right text-lg" />
        </button>
      )}
    </div>
  );
};

export default TagCarousel;
