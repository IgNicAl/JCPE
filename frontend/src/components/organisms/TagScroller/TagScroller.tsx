import React from 'react';
import styles from './TagScroller.module.css';

interface Tag {
  id: string;
  label: string;
  imageUrl?: string;
}

interface TagScrollerProps {
  tags?: Tag[];
  className?: string;
}

const DEFAULT_TAGS: Tag[] = [
  { id: 'food', label: '#food' },
  { id: 'animal', label: '#animal' },
  { id: 'car', label: '#car' },
  { id: 'sport', label: '#sport' },
  { id: 'music', label: '#music' },
  { id: 'technology', label: '#technology' },
  { id: 'abstract', label: '#abstract' },
  { id: 'nature', label: '#Nature' },
];

const TagScroller: React.FC<TagScrollerProps> = ({
  tags = DEFAULT_TAGS,
  className = '',
}) => {
  const handleRightArrowClick = () => {
    const container = document.querySelector(`.${styles.tagsContainer}`);
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={`${styles.tagScroller} ${className}`}>
      <div className={styles.background} />
      <div className={styles.tagsContainer}>
        {tags.map((tag) => (
          <div key={tag.id} className={styles.hashtag}>
            {tag.imageUrl && (
              <div className={styles.tagImage}>
                <img src={tag.imageUrl} alt={tag.label} />
                <div className={styles.imageOverlay} />
              </div>
            )}
            <span className={styles.tagLabel}>{tag.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.fadeOverlay} />
      <button
        type="button"
        onClick={handleRightArrowClick}
        className={styles.scrollArrow}
        aria-label="Rolar tags para direita"
      >
        <div className={styles.arrowBackground} />
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
};

export default TagScroller;

