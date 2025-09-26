import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';

const ROUTE = {
  LOGIN: '/login',
  HOME: '/',
};


function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to={ROUTE.HOME} replace />;
  }

  return children;
}

export default ProtectedRoute;
