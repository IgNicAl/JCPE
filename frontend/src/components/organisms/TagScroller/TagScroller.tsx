import React, { useRef, useState, useEffect } from 'react';
import styles from './TagScroller.module.css';

interface Tag {
  id: string;
  label: string;
  imageUrl?: string;
}

interface TagScrollerProps {
  tags?: Tag[];
  className?: string;
  onTagClick?: (tag: Tag) => void;
  scrollAmount?: number;
}

const DEFAULT_TAGS: Tag[] = [
  { id: 'food', label: '#food' },
  { id: 'animal', label: '#animal' },
  { id: 'car', label: '#car' },
  { id: 'sport', label: '#sport' },
  { id: 'music', label: '#music' },
  { id: 'technology', label: '#technology' },
  { id: 'abstract', label: '#abstract' },
  { id: 'nature', label: '#nature' },
];

const TagScroller: React.FC<TagScrollerProps> = ({
  tags = DEFAULT_TAGS,
  className = '',
  onTagClick,
  scrollAmount = 200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);

    // Atualiza quando a janela é redimensionada
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [tags]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const scrollValue = direction === 'right' ? scrollAmount : -scrollAmount;
    containerRef.current.scrollBy({
      left: scrollValue,
      behavior: 'smooth'
    });
  };

  const handleTagClick = (tag: Tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, tag: Tag) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTagClick(tag);
    }
  };

  return (
    <div className={`${styles.tagScroller} ${className}`}>
      <div className={styles.background} />
      <div
        ref={containerRef}
        className={styles.tagsContainer}
        role="list"
        aria-label="Lista de tags"
      >
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={styles.hashtag}
            onClick={() => handleTagClick(tag)}
            onKeyDown={(e) => handleKeyDown(e, tag)}
            role="listitem"
            tabIndex={onTagClick ? 0 : -1}
            aria-label={`Tag ${tag.label}`}
          >
            {tag.imageUrl && (
              <div className={styles.tagImage}>
                <img
                  src={tag.imageUrl}
                  alt={tag.label}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
              </div>
            )}
            <span className={styles.tagLabel}>{tag.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.fadeOverlay} />

      {/* Botão de scroll à esquerda */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
          aria-label="Rolar tags para esquerda"
        >
          <div className={styles.arrowBackground} />
          <i className="fas fa-chevron-left" />
        </button>
      )}

      {/* Botão de scroll à direita */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
          aria-label="Rolar tags para direita"
        >
          <div className={styles.arrowBackground} />
          <i className="fas fa-chevron-right" />
        </button>
      )}
    </div>
  );
};

export default TagScroller;

