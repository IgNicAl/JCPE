/**
 * Funções de formatação reutilizáveis
 */

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  });
};

/**
 * Formata uma data e hora para o formato brasileiro
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Trunca um texto para um número máximo de caracteres
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Formata um número como moeda brasileira
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um número com separadores de milhar
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Capitaliza a primeira letra de uma string
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formata tempo em segundos para mm:ss
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

