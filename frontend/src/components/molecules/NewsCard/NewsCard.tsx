import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import styles from './NewsCard.module.css';
import { News } from '@/types';

interface Category {
  id?: string;
  label: string;
  color?: string;
}

interface NewsCardProps {
  news: News & {
    summary: string;
    slug: string;
    featuredImageUrl?: string;
    publicationDate: string;
  };
  category?: Category;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, category, className = '' }) => {
  const classes = [styles.newsCard, className].filter(Boolean).join(' ');

  return (
    <Link to={`/noticia/${news.slug}`} className={classes}>
      <div
        className={styles.cardImage}
        style={{ backgroundImage: `url(${news.featuredImageUrl})` }}
      >
        {category && (
          <Badge variant="primary" className={styles.cardBadge}>
            {category.label}
          </Badge>
        )}
        <h3 className={styles.cardTitle}>{news.title}</h3>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardSummary}>{news.summary}</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardDate}>
            <i className="fas fa-calendar" />
            {new Date(news.publicationDate).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(NewsCard);

