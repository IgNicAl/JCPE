import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * @description Hook customizado para acessar o contexto de autenticação.
 * Garante que o hook seja usado dentro de um AuthProvider.
 * @returns {object} O valor do contexto de autenticação.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

/**
 * @description Provedor de contexto que gerencia o estado de autenticação do usuário,
 * como login, logout e verificação de permissões.
 * @param {object} props As propriedades do componente.
 * @param {React.ReactNode} props.children Os componentes filhos que terão acesso ao contexto.
 * @returns {JSX.Element} O provedor de contexto com o estado de autenticação.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar o usuário do localStorage na inicialização da aplicação.
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * @description Realiza o login do usuário, atualizando o estado e o localStorage.
   * @param {object} userData Os dados do usuário para armazenar.
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * @description Realiza o logout do usuário, limpando o estado e o localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  /**
   * @description Verifica se há um usuário autenticado.
   * @returns {boolean} `true` se o usuário estiver autenticado.
   */
  const isAuthenticated = () => user !== null;

  /**
   * @description Verifica se o usuário autenticado é um administrador.
   * @returns {boolean} `true` se o usuário for do tipo 'ADMIN'.
   */
  const isAdmin = () => user && user.tipoUser === 'ADMIN';

  /**
   * @description Verifica se o usuário autenticado é um jornalista.
   * @returns {boolean} `true` se o usuário for do tipo 'JORNALISTA'.
   */
  const isJornalista = () => user && user.tipoUser === 'JORNALISTA';

  // NOTE: O objeto 'value' é memorizado pelo React e passado para todos os
  // consumidores do contexto.
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isJornalista,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
