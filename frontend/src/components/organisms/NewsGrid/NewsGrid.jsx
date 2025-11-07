import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import FeaturedCard from '@/components/molecules/FeaturedCard';
import NewsCard from '@/components/molecules/NewsCard';
import { NEWS_CATEGORIES } from '@/utils/constants';
import styles from './NewsGrid.module.css';

/**
 * Componente NewsGrid para exibir grid de notícias
 */
function NewsGrid({ news, loading, error, className = '' }) {
  const featured = useMemo(
    () => news.find((n) => n.isFeatured) || (news.length > 0 ? news[0] : null),
    [news]
  );

  const remaining = useMemo(
    () => news.filter((n) => n.id !== featured?.id),
    [news, featured]
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <i className="fas fa-spinner fa-spin" />
        <p>Carregando notícias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <i className="fas fa-exclamation-circle" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.newsGrid} ${className}`}>
      {featured && <FeaturedCard news={featured} className={styles.featured} />}

      {remaining.length > 0 ? (
        <div className={styles.newsList}>
          {remaining.map((n) => {
            const category = NEWS_CATEGORIES.find((c) => c.id === (n.category || 'noticias')) || NEWS_CATEGORIES[0];
            return <NewsCard key={n.id} news={n} category={category} />;
          })}
        </div>
      ) : (
        !featured && (
          <div className={styles.noNews}>
            <p>Nenhuma notícia disponível</p>
          </div>
        )
      )}
    </div>
  );
}

NewsGrid.propTypes = {
  news: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      featuredImageUrl: PropTypes.string,
      publicationDate: PropTypes.string.isRequired,
      isFeatured: PropTypes.bool,
      category: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default memo(NewsGrid);

