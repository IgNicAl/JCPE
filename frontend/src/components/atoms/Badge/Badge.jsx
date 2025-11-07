import React from 'react';
import PropTypes from 'prop-types';
import styles from './Badge.module.css';

/**
 * Componente Badge reutilizável
 */
function Badge({ children, variant = 'default', className = '' }) {
  const classes = [
    styles.badge,
    styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'error', 'warning']),
  className: PropTypes.string,
};

export default Badge;

