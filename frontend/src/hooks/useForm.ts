import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

interface ValidationRules {
  [key: string]: (value: unknown) => string | null;
}

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: FormEvent<HTMLFormElement>) => void;
  validate: () => { isValid: boolean; errors: FormErrors };
  reset: () => void;
  setValue: (name: string, value: unknown) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * Hook para gerenciamento de formulários
 */
export const useForm = <T extends Record<string, unknown>>(
  initialValues: T = {} as T,
  validationRules: ValidationRules = {}
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      const newValue = type === 'checkbox' ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      } as T));

      // Limpar erro do campo quando o usuário começar a digitar
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const validate = useCallback((): { isValid: boolean; errors: FormErrors } => {
    if (Object.keys(validationRules).length === 0) {
      return { isValid: true, errors: {} };
    }

    const newErrors: FormErrors = {};
    Object.keys(validationRules).forEach((key) => {
      const rule = validationRules[key];
      const error = rule(values[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  }, [values, validationRules]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => {
      return (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation = validate();
        if (validation.isValid) {
          onSubmit(values);
        }
      };
    },
    [values, validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    } as T));
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

