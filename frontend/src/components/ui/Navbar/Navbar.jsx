import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// Corrigido: O caminho do import para o AuthContext foi ajustado
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import './Navbar.css';

const ROUTE = {
  HOME: '/',
  MANAGE_NEWS: '/noticias/gerenciar',
  MANAGE_USERS: '/usuarios',
  LOGIN: '/login',
  // Corrigido: A rota de cadastro de usuário comum
  REGISTER_USER: '/cadastro',
  // Corrigido: A rota de cadastro interno (Admin/Jornalista)
  REGISTER_INTERNAL: '/cadastro-interno',
};
const LOGO_TEXT = 'JCPM News';

function Navbar() {
  const { user, logout, isAdmin, isJornalista } = useContext(AuthContext);

  const renderAdminJornalistaLinks = () => (
    (isAdmin() || isJornalista()) && (
      <Link to={ROUTE.MANAGE_NEWS} className="nav-btn nav-btn-admin">
        <i className="fas fa-edit"></i> Gerenciar Notícias
      </Link>
    )
  );

  const renderAdminLinks = () => (
    isAdmin() && (
      <Link to={ROUTE.MANAGE_USERS} className="nav-btn nav-btn-admin">
        <i className="fas fa-users-cog"></i> Gerenciar Usuários
      </Link>
    )
  );

  const renderUserInfo = () => (
    user && (
      <div className="nav-user-info">
        <span className="nav-welcome">
          Olá, <strong>{user.nome}</strong>
        </span>
        <button onClick={logout} className="nav-btn nav-btn-logout">
          <i className="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    )
  );

  const renderAuthenticatedActions = () => (
    <>
      {renderAdminJornalistaLinks()}
      {renderAdminLinks()}
      {renderUserInfo()}
    </>
  );

  const renderVisitorActions = () => (
    <>
      <Link to={ROUTE.LOGIN} className="nav-btn nav-btn-login">
        <i className="fas fa-sign-in-alt"></i> Login
      </Link>
      <Link to={ROUTE.REGISTER_USER} className="nav-btn nav-btn-register">
        <i className="fas fa-user-plus"></i> Cadastrar
      </Link>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={ROUTE.HOME} className="navbar-logo">
          <i className="fas fa-newspaper"></i> {LOGO_TEXT}
        </Link>
        <div className="nav-user-actions">
          {user ? renderAuthenticatedActions() : renderVisitorActions()}
        </div>
        <div className="menu-icon">
          <i className="fas fa-bars" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
