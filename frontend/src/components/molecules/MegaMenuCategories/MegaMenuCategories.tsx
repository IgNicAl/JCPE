import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './MegaMenuCategories.module.css';

interface SubCategory {
  label: string;
  path: string;
}

interface Category {
  title: string;
  subcategories: SubCategory[];
  image: string;
}

interface MegaMenuCategoriesProps {
  className?: string;
  onItemClick?: () => void;
}

/**
 * Mega menu com categorias e slider de imagens (inspirado no Figma)
 */
const MegaMenuCategories: React.FC<MegaMenuCategoriesProps> = ({
  className = '',
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const categories: Category[] = [
    {
      title: 'Pernambuco',
      image: 'https://placehold.co/190x190/0066cc/ffffff?text=Pernambuco',
      subcategories: [
        { label: 'Região Metropolitana', path: '/categoria/pernambuco/metropolitana' },
        { label: 'Segurança Pública', path: '/categoria/pernambuco/seguranca' },
        { label: 'Mobilidade', path: '/categoria/pernambuco/mobilidade' },
        { label: 'Interior', path: '/categoria/pernambuco/interior' },
      ],
    },
    {
      title: 'Política',
      image: 'https://placehold.co/190x190/0066cc/ffffff?text=Politica',
      subcategories: [
        { label: 'Governo Federal', path: '/categoria/politica/federal' },
        { label: 'Congresso e STF', path: '/categoria/politica/congresso-stf' },
        { label: 'Eleições', path: '/categoria/politica/eleicoes' },
      ],
    },
    {
      title: 'Cultura',
      image: 'https://placehold.co/190x190/0066cc/ffffff?text=Cultura',
      subcategories: [
        { label: 'Música', path: '/categoria/cultura/musica' },
        { label: 'Cinema', path: '/categoria/cultura/cinema' },
        { label: 'Teatro', path: '/categoria/cultura/teatro' },
        { label: 'Literatura', path: '/categoria/cultura/literatura' },
      ],
    },
    {
      title: 'Mundo',
      image: 'https://placehold.co/190x190/0066cc/ffffff?text=Mundo',
      subcategories: [
        { label: 'Américas', path: '/categoria/mundo/americas' },
        { label: 'Europa', path: '/categoria/mundo/europa' },
        { label: 'Ásia e Oceania', path: '/categoria/mundo/asia-oceania' },
        { label: 'Oriente Médio', path: '/categoria/mundo/oriente-medio' },
      ],
    },
  ];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onItemClick) onItemClick();
  };

  const handleSlideNext = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const handleSlidePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className={`${styles.megaMenu} ${className}`} ref={dropdownRef}>
      <div
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu de categorias"
      >
        <span className={styles.label}>Categorias</span>
        <i className={`fas fa-chevron-down ${styles.icon}`} />
      </div>

      {isOpen && (
        <div className={styles.megaMenuContent} role="menu">
          <div className={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <div key={index} className={styles.categoryItem}>
                <img
                  src={category.image}
                  alt={category.title}
                  className={styles.categoryImage}
                />
                <div className={styles.categoryContent}>
                  <div className={styles.categoryTitle}>
                    <div className={styles.titleIndicator} />
                    <h3>{category.title}</h3>
                  </div>
                  <div className={styles.subcategories}>
                    {category.subcategories.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        className={styles.subcategoryLink}
                        onClick={handleItemClick}
                        role="menuitem"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider lateral */}
          <div className={styles.slider}>
            <div
              className={styles.sliderImages}
              style={{ transform: `translateY(-${currentSlide * 215}px)` }}
            >
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`${styles.sliderImage} ${
                    index === currentSlide ? styles.activeSlide : ''
                  }`}
                >
                  <img src={category.image} alt={category.title} />
                  <div className={styles.sliderOverlay}>
                    <span>{category.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`${styles.sliderArrow} ${styles.arrowUp}`}
              onClick={handleSlidePrev}
              aria-label="Categoria anterior"
            >
              <i className="fas fa-chevron-up" />
            </button>

            <button
              className={`${styles.sliderArrow} ${styles.arrowDown}`}
              onClick={handleSlideNext}
              aria-label="Próxima categoria"
            >
              <i className="fas fa-chevron-down" />
            </button>
          </div>
        </div>
      )}

      {/* Underline indicator */}
      <div className={`${styles.underline} ${isOpen ? styles.active : ''}`} />
    </div>
  );
};

export default MegaMenuCategories;

