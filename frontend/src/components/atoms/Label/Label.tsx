import React, { ReactNode } from 'react';
import styles from './Label.module.css';

interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, required = false, icon, children, className = '' }) => {
  const classes = [styles.label, className].filter(Boolean).join(' ');

  return (
    <label htmlFor={htmlFor} className={classes}>
      {icon && <span className={styles.labelIcon}>{icon}</span>}
      {children}
      {required && <span className={styles.required}> *</span>}
    </label>
  );
};

export default Label;

