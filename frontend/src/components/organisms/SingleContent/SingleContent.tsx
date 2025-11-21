import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SingleContent.module.css';

interface SingleContentProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
  className?: string;
}

const SingleContent: React.FC<SingleContentProps> = ({

  title,
  summary,
  imageUrl,
  slug,
  className = '',
}) => {
  return (
    <Link to={`/noticia/${slug}`} className={`${styles.singleContent} ${className}`}>
      <div
        className={styles.contentImage}
        style={{ backgroundImage: `url('${imageUrl}')` } as React.CSSProperties}
      >
        <div className={styles.imageOverlay} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.contentTitle}>{title}</h2>
          <p className={styles.contentSummary}>{summary}</p>
        </div>
      </div>
    </Link>
  );
};

export default SingleContent;
