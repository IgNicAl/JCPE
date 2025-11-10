import React from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  showArrows?: boolean;
  showButton?: boolean;
  buttonText?: string;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
  onButtonClick?: () => void;
  leftArrowDisabled?: boolean;
  rightArrowDisabled?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showArrows = false,
  showButton = false,
  buttonText = 'Show all',
  onLeftArrowClick,
  onRightArrowClick,
  onButtonClick,
  leftArrowDisabled = false,
  rightArrowDisabled = false,
  className = '',
}) => {
  return (
    <div className={`${styles.headerSection} ${className}`}>
      <div className={styles.titleSection}>
        <div className={styles.accentBar} />
        <h2 className={styles.title}>{title}</h2>
      </div>
      {showArrows && (
        <div className={styles.arrowSlider}>
          <button
            type="button"
            onClick={onLeftArrowClick}
            disabled={leftArrowDisabled}
            className={`${styles.arrow} ${leftArrowDisabled ? styles.disabled : ''}`}
            aria-label="Anterior"
          >
            <div className={styles.arrowBackground} />
            <i className="fas fa-chevron-left" />
          </button>
          <button
            type="button"
            onClick={onRightArrowClick}
            disabled={rightArrowDisabled}
            className={`${styles.arrow} ${rightArrowDisabled ? styles.disabled : ''}`}
            aria-label="Próximo"
          >
            <div className={styles.arrowBackground} />
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
      {showButton && (
        <button
          type="button"
          onClick={onButtonClick}
          className={styles.showAllButton}
          aria-label={buttonText}
        >
          <span>{buttonText}</span>
          <i className="fas fa-chevron-right" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;

