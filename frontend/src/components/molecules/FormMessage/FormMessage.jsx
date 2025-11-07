import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/atoms/Icon';
import styles from './FormMessage.module.css';

/**
 * Componente FormMessage para mensagens de sucesso/erro
 */
function FormMessage({ type = 'info', message, className = '' }) {
  if (!message) return null;

  const classes = [
    styles.message,
    styles[`message${type.charAt(0).toUpperCase() + type.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconName =
    type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

  return (
    <div className={classes}>
      <Icon name={iconName} />
      <span>{message}</span>
    </div>
  );
}

FormMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  message: PropTypes.string,
  className: PropTypes.string,
};

export default FormMessage;

