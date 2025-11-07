/**
 * Funções auxiliares reutilizáveis
 */

/**
 * Obtém as iniciais de um nome
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Classe CSS condicional
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Verifica se um valor está vazio
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clone de um objeto
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove acentos de uma string
 */
export const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Gera um slug a partir de uma string
 */
export const slugify = (text) => {
  return removeAccents(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Pad left com zeros
 */
export const pad = (n, width = 2) => {
  return String(n).padStart(width, '0');
};

