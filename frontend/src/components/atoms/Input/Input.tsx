import React, { ReactNode, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  error?: boolean;
  icon?: ReactNode;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  error = false,
  icon,
  required = false,
  className = '',
  ...props
}) => {
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
};

export default Input;

