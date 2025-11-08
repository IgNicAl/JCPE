import React, { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import { UserType } from '@/types';

const ROUTE = {
  LOGIN: '/login',
  HOME: '/',
} as const;

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserType[];
}

/**
 * @description Componente de ordem superior que protege rotas. Redireciona usuários
 * não autenticados ou sem as permissões necessárias.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <div className="loading-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const { user, isAuthenticated, loading } = authContext;

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

  if (!isAuthenticated()) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  // Se a rota exige papéis específicos, verifica se o usuário tem algum deles.
  if (roles.length > 0 && user && !roles.includes(user.userType)) {
    return <Navigate to={ROUTE.HOME} replace />; // Redireciona se não tiver permissão
  }

  return <>{children}</>;
};

export default ProtectedRoute;

