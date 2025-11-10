import React from 'react';
import styles from './InstagramGrid.module.css';

const InstagramGrid: React.FC = () => {
  // Array de 6 imagens placeholder (substituir por dados reais da API do Instagram)
  const instagramPosts = Array.from({ length: 6 }, (_, i) => ({
    id: `post-${i + 1}`,
    imageUrl: `https://via.placeholder.com/200x200?text=Post+${i + 1}`,
    link: '#',
  }));

  const handlePostClick = (link: string) => {
    // Abrir link do Instagram em nova aba
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.instagramGrid}>
      <div className={styles.titleSection}>
        <div className={styles.titleIndicator} />
        <h4 className={styles.sectionTitle}>Follow On Instagram</h4>
      </div>

      <div className={styles.gridContainer}>
        {instagramPosts.map((post) => (
          <button
            key={post.id}
            className={styles.gridItem}
            onClick={() => handlePostClick(post.link)}
            aria-label={`Ver post ${post.id} no Instagram`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePostClick(post.link);
              }
            }}
          >
            <img
              src={post.imageUrl}
              alt={`Instagram post ${post.id}`}
              className={styles.gridImage}
              loading="lazy"
            />
            <div className={styles.overlay}>
              <i className="fab fa-instagram" />
            </div>
          </button>
        ))}
      </div>

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.followButton}
        aria-label="Seguir no Instagram"
      >
        <span>Seguir</span>
        <i className="fas fa-chevron-right" />
      </a>
    </div>
  );
};

export default InstagramGrid;

