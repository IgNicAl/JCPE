import React from 'react';
import PropTypes from 'prop-types';
import styles from './Label.module.css';

/**
 * Componente Label reutilizável
 */
function Label({ htmlFor, required = false, icon, children, className = '' }) {
  const classes = [styles.label, className].filter(Boolean).join(' ');

  return (
    <label htmlFor={htmlFor} className={classes}>
      {icon && <span className={styles.labelIcon}>{icon}</span>}
      {children}
      {required && <span className={styles.required}> *</span>}
    </label>
  );
}

Label.propTypes = {
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Label;

