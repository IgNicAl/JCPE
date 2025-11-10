import React from 'react';
import styles from './NotificationIcon.module.css';

interface NotificationIconProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * Ícone de notificações com badge de contagem
 */
const NotificationIcon: React.FC<NotificationIconProps> = ({
  count = 0,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${styles.notificationIcon} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Notificações${count > 0 ? `, ${count} não lidas` : ''}`}
    >
      <div className={styles.iconWrapper}>
        <i className="fas fa-bell" />
        {count > 0 && (
          <span className={styles.badge} aria-label={`${count} notificações`}>
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationIcon;

