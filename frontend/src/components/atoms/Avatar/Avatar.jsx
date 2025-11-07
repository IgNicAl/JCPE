import React from 'react';
import PropTypes from 'prop-types';
import { getInitials } from '@/utils/helpers';
import styles from './Avatar.module.css';

/**
 * Componente Avatar com fallback para iniciais
 */
function Avatar({ src, alt, name, size = 'md', className = '' }) {
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
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Avatar;

