import React, { ReactNode, ChangeEvent } from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import styles from './FormField.module.css';

interface FormFieldProps {
  id: string;
  name?: string;
  label: string;
  type?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
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
}) => {
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
};

export default FormField;

