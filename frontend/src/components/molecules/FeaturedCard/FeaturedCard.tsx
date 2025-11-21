import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import styles from './FeaturedCard.module.css';
import { News } from '@/types';

interface FeaturedCardProps {
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
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ news, className = '' }) => {
  const classes = [styles.featuredCard, className].filter(Boolean).join(' ');
  const authorName = (news as any).authorName || 'Redação JCPE';
  const authorAvatar = (news as any).authorAvatar;
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState((news as any).likes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount((prev: number) => liked ? prev - 1 : prev + 1);
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
        className={styles.featuredImage}
        style={{ backgroundImage: `url('${news.featuredImageUrl}')` }}
      />
      <div className={styles.featuredContent}>
        <Badge variant="warning" className={styles.featuredBadge}>
          <i className="fas fa-star" /> DESTAQUE
        </Badge>
        <h2 className={styles.featuredTitle}>{news.title}</h2>
        <p className={styles.featuredSummary}>{(news as any).summary}</p>
        <div className={styles.featuredFooter}>
          <div className={styles.featuredMeta}>
            <div className={styles.authorSection}>
              <Avatar
                src={authorAvatar}
                name={authorName}
                size="md"
                className={styles.authorAvatar}
              />
              <div className={styles.authorDetails}>
                <div className={styles.authorName}>{authorName}</div>
                <span className={styles.dateText}>
                  <i className="fas fa-calendar" />
                  {new Date(news.publicationDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.featuredActions}>
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

export default React.memo(FeaturedCard);

