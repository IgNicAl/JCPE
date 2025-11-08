import React from 'react';
import styles from './FormMessage.module.css';

interface FormMessageProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message?: string;
  className?: string;
}

const FormMessage: React.FC<FormMessageProps> = ({ type = 'info', message, className = '' }) => {
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
      <i className={`fas ${iconName}`} />
      <span>{message}</span>
    </div>
  );
};

export default FormMessage;

