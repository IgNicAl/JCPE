import React from 'react';
import PropTypes from 'prop-types';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import styles from './FormField.module.css';

/**
 * Componente FormField que combina Label + Input + mensagem de erro
 */
function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={`${styles.formField} ${className}`}>
      <Label htmlFor={id} required={required} icon={icon}>
        {label}
      </Label>
      <Input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        error={!!error}
        icon={icon}
        className={error ? styles.inputError : ''}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default FormField;

