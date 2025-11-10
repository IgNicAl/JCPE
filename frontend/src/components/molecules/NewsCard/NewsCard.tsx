import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@/components/atoms/Avatar';
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
    authorName?: string;
    authorAvatar?: string;
  };
  category?: Category;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, category, className = '' }) => {
  const classes = [styles.newsCard, className].filter(Boolean).join(' ');
  const authorName = (news as any).authorName || 'Autor';
  const authorAvatar = (news as any).authorAvatar;

  return (
    <Link to={`/noticia/${news.slug}`} className={classes}>
      <div
        className={styles.cardImage}
        style={{ backgroundImage: `url(${news.featuredImageUrl})` }}
      />
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>
          <h3>{news.title}</h3>
        </div>
        <div className={styles.cardSummary}>
          {news.summary}
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.footerContent}>
            <Avatar
              src={authorAvatar}
              name={authorName}
              size="md"
              className={styles.authorAvatar}
            />
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>{authorName}</div>
              <div className={styles.cardDate}>
                {new Date(news.publicationDate).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
          <div className={styles.cardIcon}>
            <i className="far fa-bookmark" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(NewsCard);

