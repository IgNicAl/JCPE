import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import Icon from '@/components/atoms/Icon';
import styles from './FeaturedCard.module.css';

/**
 * Componente FeaturedCard para notícias em destaque
 */
function FeaturedCard({ news, className = '' }) {
  const classes = [styles.featuredCard, className].filter(Boolean).join(' ');

  return (
    <Link to={`/noticia/${news.slug}`} className={classes}>
      <div
        className={styles.featuredImage}
        style={{ backgroundImage: `url(${news.featuredImageUrl})` }}
      />
      <div className={styles.featuredContent}>
        <Badge variant="warning" className={styles.featuredBadge}>
          <Icon name="fa-star" size="sm" /> DESTAQUE
        </Badge>
        <h2 className={styles.featuredTitle}>{news.title}</h2>
        <p className={styles.featuredSummary}>{news.summary}</p>
        <div className={styles.featuredMeta}>
          <span>
            <Icon name="fa-calendar" size="sm" />
            {new Date(news.publicationDate).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </Link>
  );
}

FeaturedCard.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    featuredImageUrl: PropTypes.string,
    publicationDate: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

export default React.memo(FeaturedCard);

