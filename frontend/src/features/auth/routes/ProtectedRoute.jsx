import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';

// NOTE: Constantes para as rotas ajudam a evitar erros de digitação e facilitam a manutenção.
const ROUTE = {
  LOGIN: '/login',
  HOME: '/',
};

/**
 * @description Componente de ordem superior que protege rotas. Redireciona usuários
 * não autenticados para a página de login e usuários sem permissão de admin
 * para a home. Exibe um estado de carregamento enquanto verifica a autenticação.
 * @param {object} props As propriedades do componente.
 * @param {React.ReactNode} props.children O componente a ser renderizado se o usuário tiver permissão.
 * @param {boolean} [props.requireAdmin=false] Se a rota exige permissões de administrador.
 * @returns {JSX.Element} O componente filho, um redirecionamento ou um indicador de carregamento.
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  // Exibe um spinner enquanto o estado de autenticação está sendo verificado.
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Redireciona para o login se o usuário não estiver autenticado.
  if (!isAuthenticated()) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  // Redireciona para a home se a rota exigir admin e o usuário não for.
  // FIXME: Esta lógica não utiliza a prop 'roles' passada no App.jsx. É um bug intencional.
  if (requireAdmin && !isAdmin()) {
    return <Navigate to={ROUTE.HOME} replace />;
  }

  return children;
}

export default ProtectedRoute;
