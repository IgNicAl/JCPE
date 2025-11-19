import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './DropdownPages.module.css';

interface DropdownPagesProps {
  className?: string;
  onItemClick?: () => void;
}

/**
 * Dropdown menu com as páginas do projeto
 */
const DropdownPages: React.FC<DropdownPagesProps> = ({ className = '', onItemClick }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

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

  const pages = [
    { path: '/recife', label: 'Recife em 5 min', requiresAuth: false },
    { path: '/jogos', label: 'Jogos', requiresAuth: false },
    { path: '/clima', label: 'Clima', requiresAuth: false },
    { path: '/empreendedorismo', label: 'Empreendedorismo', requiresAuth: false },
    { path: '/chat', label: 'Assistente IA', requiresAuth: true, icon: 'fas fa-robot' },
  ];

  const visiblePages = pages.filter((page) => !page.requiresAuth || user);

  return (
    <div className={`${styles.dropdownPages} ${className}`} ref={dropdownRef}>
      <div
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu de páginas"
      >
        <span className={styles.label}>Páginas</span>
        <i className={`fas fa-chevron-down ${styles.icon}`} />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {visiblePages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className={styles.menuItem}
              onClick={handleItemClick}
              role="menuitem"
            >
              {page.icon && <i className={page.icon} />}
              {page.label}
            </Link>
          ))}
        </div>
      )}

      {/* Underline indicator */}
      <div className={`${styles.underline} ${isOpen ? styles.active : ''}`} />
    </div>
  );
};

export default DropdownPages;

