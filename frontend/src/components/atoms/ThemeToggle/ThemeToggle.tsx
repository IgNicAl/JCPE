import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Botão para alternar entre tema claro e escuro.
 * Utiliza o contexto de tema para gerenciar o estado.
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      className={`${styles.themeToggle} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      type="button"
    >
      <div className={styles.iconWrapper}>
        {theme === 'light' ? (
          <i className="fas fa-moon" aria-hidden="true" />
        ) : (
          <i className="fas fa-sun" aria-hidden="true" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;


