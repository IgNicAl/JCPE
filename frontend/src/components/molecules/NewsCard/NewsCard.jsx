import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import Icon from '@/components/atoms/Icon';
import styles from './NewsCard.module.css';

/**
 * Componente NewsCard para exibir notícias
 */
function NewsCard({ news, category, className = '' }) {
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
            <Icon name="fa-calendar" size="sm" />
            {new Date(news.publicationDate).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </Link>
  );
}

NewsCard.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    featuredImageUrl: PropTypes.string,
    publicationDate: PropTypes.string.isRequired,
  }).isRequired,
  category: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    color: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default React.memo(NewsCard);

