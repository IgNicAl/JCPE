import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import styles from './FeaturedCard.module.css';
import { News } from '@/types';

interface FeaturedCardProps {
  news: News & {
    summary: string;
    slug: string;
    featuredImageUrl?: string;
    publicationDate: string;
  };
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ news, className = '' }) => {
  const classes = [styles.featuredCard, className].filter(Boolean).join(' ');

  return (
    <Link to={`/noticia/${news.slug}`} className={classes}>
      <div
        className={styles.featuredImage}
        style={{ backgroundImage: `url(${news.featuredImageUrl})` }}
      />
      <div className={styles.featuredContent}>
        <Badge variant="warning" className={styles.featuredBadge}>
          <i className="fas fa-star" /> DESTAQUE
        </Badge>
        <h2 className={styles.featuredTitle}>{news.title}</h2>
        <p className={styles.featuredSummary}>{news.summary}</p>
        <div className={styles.featuredMeta}>
          <span>
            <i className="fas fa-calendar" />
            {new Date(news.publicationDate).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(FeaturedCard);

