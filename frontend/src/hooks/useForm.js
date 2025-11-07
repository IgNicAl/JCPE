import { useState, useCallback } from 'react';
import { validateForm as validateFormUtil } from '@/utils/validators';

/**
 * Hook para gerenciamento de formulários
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const validate = useCallback(() => {
    if (Object.keys(validationRules).length === 0) {
      return { isValid: true, errors: {} };
    }

    const result = validateFormUtil(values, validationRules);
    setErrors(result.errors);
    return result;
  }, [values, validationRules]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      const validation = validate();
      if (validation.isValid) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setValue,
    setValues,
  };
};

