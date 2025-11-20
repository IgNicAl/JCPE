import React, { useState, useEffect } from 'react';
import { newsService } from '@/services/api';
import styles from './RatingStars.module.css';

interface RatingStarsProps {
  newsId?: string;
  initialRating?: number;
  totalRatings?: number;
  readonly?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  newsId,
  initialRating = 0,
  totalRatings = 0,
  readonly = false,
  onRate,
  className = '',
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar avaliação do usuário se houver newsId
  useEffect(() => {
    if (newsId && !readonly) {
      loadUserRating();
    }
  }, [newsId, readonly]);

  const loadUserRating = async () => {
    if (!newsId) return;
    try {
      const response = await newsService.getUserRating(newsId);
      if (response.data.rating) {
        setUserRating(response.data.rating);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliação do usuário:', error);
    }
  };

  const handleClick = async (selectedRating: number) => {
    if (readonly || !newsId) return;

    setIsLoading(true);
    try {
      await newsService.rateNews(newsId, selectedRating);
      setUserRating(selectedRating);
      setRating(selectedRating);
      if (onRate) {
        onRate(selectedRating);
      }
    } catch (error) {
      console.error('Erro ao avaliar notícia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || userRating || rating;

  return (
    <div className={`${styles.ratingContainer} ${className}`}>
      <div className={styles.stars} onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${
              star <= displayRating ? styles.starFilled : styles.starEmpty
            } ${readonly ? styles.starReadonly : ''} ${isLoading ? styles.starDisabled : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            disabled={readonly || isLoading}
            aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
          >
            ★
          </button>
        ))}
      </div>
      <div className={styles.ratingInfo}>
        {totalRatings > 0 && (
          <span className={styles.ratingText}>
            {rating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'avaliação' : 'avaliações'})
          </span>
        )}
        {userRating && !readonly && (
          <span className={styles.userRatingText}>Sua avaliação: {userRating} ★</span>
        )}
      </div>
    </div>
  );
};

export default RatingStars;
