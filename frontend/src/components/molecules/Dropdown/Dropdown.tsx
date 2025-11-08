import React, { ReactNode } from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, children, className = '', align = 'right' }) => {
  if (!isOpen) return null;

  const classes = [
    styles.dropdown,
    styles[`dropdown${align.charAt(0).toUpperCase() + align.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
};

export default Dropdown;

