import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

/**
 * Componente Input reutilizável
 */
function Input({
  type = 'text',
  placeholder = '',
  error = false,
  icon,
  required = false,
  className = '',
  ...props
}) {
  const classes = [
    styles.input,
    error && styles.inputError,
    icon && styles.inputWithIcon,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.inputWrapper}>
      {icon && <span className={styles.inputIcon}>{icon}</span>}
      <input
        type={type}
        className={classes}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  icon: PropTypes.node,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;

