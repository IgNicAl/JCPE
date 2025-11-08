/**
 * Funções de formatação reutilizáveis
 */

interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  day?: '2-digit' | 'numeric';
  month?: '2-digit' | 'numeric' | 'long' | 'short';
  year?: 'numeric' | '2-digit';
}

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (date: Date | string | null | undefined, options: DateFormatOptions = {}): string => {
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
export const formatDateTime = (date: Date | string | null | undefined): string => {
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
export const truncate = (text: string | null | undefined, maxLength = 100, suffix = '...'): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Formata um número como moeda brasileira
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um número com separadores de milhar
 */
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Capitaliza a primeira letra de uma string
 */
export const capitalize = (text: string | null | undefined): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formata tempo em segundos para mm:ss
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

