import React from 'react';
import { getInitials } from '@/utils/helpers';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', className = '' }) => {
  const classes = [
    styles.avatar,
    styles[`avatar${size.charAt(0).toUpperCase() + size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {src ? (
        <img src={src} alt={alt || name} className={styles.avatarImg} />
      ) : (
        <div className={styles.avatarInitials}>{getInitials(name)}</div>
      )}
    </div>
  );
};

export default Avatar;

