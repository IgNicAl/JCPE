/**
 * Funções de validação reutilizáveis
 */

/**
 * Valida se um email é válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se uma senha atende aos requisitos mínimos
 */
export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

/**
 * Valida se um campo está preenchido
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Valida se duas senhas coincidem
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida um formulário completo
 */
export const validateForm = (fields, rules) => {
  const errors = {};

  Object.keys(rules).forEach((fieldName) => {
    const value = fields[fieldName];
    const fieldRules = rules[fieldName];

    if (fieldRules.required && !isRequired(value)) {
      errors[fieldName] = fieldRules.requiredMessage || `${fieldName} é obrigatório`;
      return;
    }

    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[fieldName] = fieldRules.emailMessage || 'Email inválido';
      return;
    }

    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
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

