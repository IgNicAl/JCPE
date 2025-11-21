import React, { useState, useEffect } from 'react';

import styles from './HeroSlider.module.css';

interface Slide {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

interface HeroSliderProps {
  slides?: Slide[];
  className?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Why I Stopped Using Multiple Monitor',
    summary: 'A Single Monitor Manifesto — Many developers believe multiple monitors improve productivity. Studies have proven it, right? Well, keep in mind, many of those studies are commissioned from monitor manufacturers like',
    imageUrl: 'https://placehold.co/744x452',
    slug: 'multiple-monitor',
  },
];

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = DEFAULT_SLIDES,
  className = '',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`${styles.heroSlider} ${className}`}>
      <div className={styles.sliderContainer}>
        <div
          className={styles.slideImage}
          style={{ backgroundImage: `url('${currentSlideData.imageUrl}')` }}
        >
          <div className={styles.imageOverlay} />
        </div>
        <div className={styles.slideContent}>
          <div className={styles.contentWrapper}>
            <h2 className={styles.slideTitle}>{currentSlideData.title}</h2>
            <p className={styles.slideSummary}>{currentSlideData.summary}</p>
          </div>
        </div>
        {slides.length > 1 && (
          <>
            <div className={styles.arrowControls}>
              <button
                type="button"
                onClick={handlePrevious}
                className={`${styles.arrow} ${currentSlide === 0 ? styles.disabled : ''}`}
                aria-label="Slide anterior"
                disabled={currentSlide === 0}
              >
                <div className={styles.arrowBackground} />
                <i className="fas fa-chevron-left" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={`${styles.arrow} ${currentSlide === slides.length - 1 ? styles.disabled : ''}`}
                aria-label="Próximo slide"
                disabled={currentSlide === slides.length - 1}
              >
                <div className={styles.arrowBackground} />
                <i className="fas fa-chevron-right" />
              </button>
            </div>
            <div className={styles.dotsContainer}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;

