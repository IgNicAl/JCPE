import React from 'react';
import SingleContent from '@/components/organisms/SingleContent';
import HeroSlider from '@/components/organisms/HeroSlider';
import styles from './Highlights.module.css';

interface Slide {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

interface SingleContentItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

interface HighlightsProps {
  singleContentItems?: SingleContentItem[];
  sliderSlides?: Slide[];
  className?: string;
}

const Highlights: React.FC<HighlightsProps> = ({
  singleContentItems = [],
  sliderSlides = [],
  className = '',
}) => {
  const firstContent = singleContentItems[0];
  const secondContent = singleContentItems[1];

  return (
    <div className={`${styles.highlights} ${className}`}>
      {firstContent && (
        <SingleContent
          id={firstContent.id}
          title={firstContent.title}
          summary={firstContent.summary}
          imageUrl={firstContent.imageUrl}
          slug={firstContent.slug}
          className={styles.singleContentItem}
        />
      )}

      {secondContent && (
        <SingleContent
          id={secondContent.id}
          title={secondContent.title}
          summary={secondContent.summary}
          imageUrl={secondContent.imageUrl}
          slug={secondContent.slug}
          className={styles.singleContentItem}
        />
      )}

      {sliderSlides.length > 0 && (
        <HeroSlider
          slides={sliderSlides}
          className={styles.slider}
        />
      )}
    </div>
  );
};

export default Highlights;
