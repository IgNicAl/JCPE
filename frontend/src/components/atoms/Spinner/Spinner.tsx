import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
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
};

export default Spinner;

