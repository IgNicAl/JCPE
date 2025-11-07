import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Componente Button reutilizável
 * @param {string} variant - Variante do botão (primary, secondary, danger)
 * @param {string} size - Tamanho do botão (sm, md, lg)
 * @param {boolean} loading - Se está carregando
 * @param {boolean} disabled - Se está desabilitado
 * @param {function} onClick - Função de clique
 * @param {ReactNode} children - Conteúdo do botão
 * @param {string} className - Classes CSS adicionais
 * @param {string} type - Tipo do botão (button, submit, reset)
 */
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
    loading && styles.buttonLoading,
    disabled && styles.buttonDisabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <i className="fas fa-spinner fa-spin" />}
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;

