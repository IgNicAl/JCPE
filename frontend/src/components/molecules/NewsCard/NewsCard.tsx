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
    likes?: number;
    shares?: number;
  };
  category?: Category;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, category, className = '' }) => {
  const classes = [styles.newsCard, className].filter(Boolean).join(' ');
  const authorName = (news as any).authorName || 'Redação JCPE';
  const authorAvatar = (news as any).authorAvatar;
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState((news as any).likes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: (news as any).summary,
        url: window.location.origin + `/noticia/${news.slug}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/noticia/${news.slug}`);
      alert('Link copiado para a área de transferência!');
    }
  };

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
          {(news as any).summary}
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
          <div className={styles.cardActions}>
            <button 
              className={`${styles.actionButton} ${liked ? styles.liked : ''}`}
              onClick={handleLike}
              title="Curtir"
            >
              <i className={liked ? "fas fa-heart" : "far fa-heart"} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>
            <button 
              className={styles.actionButton}
              onClick={handleShare}
              title="Compartilhar"
            >
              <i className="fas fa-share-alt" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(NewsCard);

