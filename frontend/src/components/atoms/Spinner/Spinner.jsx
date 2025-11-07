import React from 'react';
import PropTypes from 'prop-types';
import styles from './Spinner.module.css';

/**
 * Componente Spinner de loading
 */
function Spinner({ size = 'md', className = '' }) {
  const classes = [
    styles.spinner,
    styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <i className="fas fa-spinner fa-spin" />
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Spinner;

