import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dropdown.module.css';

/**
 * Componente Dropdown reutilizável
 */
function Dropdown({ isOpen, onClose, children, className = '', align = 'right' }) {
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
}

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

export default Dropdown;

