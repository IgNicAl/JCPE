import React from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import NewsCard from '@/components/molecules/NewsCard';
import { News } from '@/types';
import styles from './PostSection.module.css';

interface NewsItem extends News {
  summary: string;
  slug: string;
  featuredImageUrl?: string;
  publicationDate: string;
  category?: string;
}

interface PostSectionProps {
  title: string;
  news: NewsItem[];
  showArrows?: boolean;
  showButton?: boolean;
  buttonText?: string;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
  onButtonClick?: () => void;
  leftArrowDisabled?: boolean;
  rightArrowDisabled?: boolean;
  className?: string;
}

const PostSection: React.FC<PostSectionProps> = ({
  title,
  news,
  showArrows = false,
  showButton = false,
  buttonText,
  onLeftArrowClick,
  onRightArrowClick,
  onButtonClick,
  leftArrowDisabled = false,
  rightArrowDisabled = false,
  className = '',
}) => {
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.postSection} ${className}`}>
      <SectionHeader
        title={title}
        showArrows={showArrows}
        showButton={showButton}
        buttonText={buttonText}
        onLeftArrowClick={onLeftArrowClick}
        onRightArrowClick={onRightArrowClick}
        onButtonClick={onButtonClick}
        leftArrowDisabled={leftArrowDisabled}
        rightArrowDisabled={rightArrowDisabled}
      />
      <div className={styles.postsGrid}>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </section>
  );
};

export default PostSection;

