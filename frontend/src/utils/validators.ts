/**
 * Funções de validação reutilizáveis
 */

/**
 * Valida se um email é válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se uma senha atende aos requisitos mínimos
 */
export const isValidPassword = (password: string, minLength = 6): boolean => {
  return password !== null && password !== undefined && password.length >= minLength;
};

/**
 * Valida se um campo está preenchido
 */
export const isRequired = (value: unknown): boolean => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Valida se duas senhas coincidem
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

interface ValidationRule {
  required?: boolean;
  requiredMessage?: string;
  email?: boolean;
  emailMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  match?: string;
  matchMessage?: string;
}

interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida um formulário completo
 */
export const validateForm = (fields: Record<string, unknown>, rules: ValidationRules): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((fieldName) => {
    const value = fields[fieldName];
    const fieldRules = rules[fieldName];

    if (fieldRules.required && !isRequired(value)) {
      errors[fieldName] = fieldRules.requiredMessage || `${fieldName} é obrigatório`;
      return;
    }

    if (fieldRules.email && value && typeof value === 'string' && !isValidEmail(value)) {
      errors[fieldName] = fieldRules.emailMessage || 'Email inválido';
      return;
    }

    if (fieldRules.minLength && value && typeof value === 'string' && value.length < fieldRules.minLength) {
      errors[fieldName] = fieldRules.minLengthMessage || `Mínimo de ${fieldRules.minLength} caracteres`;
      return;
    }

    if (fieldRules.match && value !== fields[fieldRules.match]) {
      errors[fieldName] = fieldRules.matchMessage || 'Os valores não coincidem';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

