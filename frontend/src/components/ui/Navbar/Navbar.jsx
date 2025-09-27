import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import './Navbar.css';

// NOTE: Constantes para as rotas ajudam a evitar erros de digitação e facilitam a manutenção.
const ROUTE = {
  HOME: '/',
  MANAGE_NEWS: '/noticias/gerenciar',
  MANAGE_USERS: '/users',
  LOGIN: '/login',
  REGISTER_USER: '/cadastro',
  REGISTER_INTERNAL: '/cadastro-interno',
};
const LOGO_TEXT = 'JCPM News';

/**
 * @description Componente de navegação principal da aplicação. Exibe links diferentes
 * com base no estado de autenticação e no tipo de usuário (admin, jornalista, visitante).
 * @returns {JSX.Element} A barra de navegação.
 */
function Navbar() {
  const { user, logout, isAdmin, isJornalista } = useContext(AuthContext);

  /**
   * @description Renderiza os links visíveis apenas para administradores e jornalistas.
   * @returns {JSX.Element | boolean} O link de gerenciamento de notícias ou `false`.
   */
  const renderAdminJornalistaLinks = () => (
    (isAdmin() || isJornalista()) && (
      <Link to={ROUTE.MANAGE_NEWS} className="nav-btn nav-btn-admin">
        <i className="fas fa-edit" /> Gerenciar Notícias
      </Link>
    )
  );

  /**
   * @description Renderiza os links visíveis apenas para administradores.
   * @returns {JSX.Element | boolean} O link de gerenciamento de usuários ou `false`.
   */
  const renderAdminLinks = () => (
    isAdmin() && (
      <Link to={ROUTE.MANAGE_USERS} className="nav-btn nav-btn-admin">
        <i className="fas fa-users-cog" /> Gerenciar Usuários
      </Link>
    )
  );

  /**
   * @description Renderiza as informações do usuário logado e o botão de logout.
   * @returns {JSX.Element | boolean} As informações do usuário ou `false`.
   */
  const renderUserInfo = () => (
    user && (
      <div className="nav-user-info">
        <span className="nav-welcome">
          Olá, <strong>{user.name}</strong>
        </span>
        <button type="button" onClick={logout} className="nav-btn nav-btn-logout">
          <i className="fas fa-sign-out-alt" /> Sair
        </button>
      </div>
    )
  );

  /**
   * @description Agrupa e renderiza todas as ações para um usuário autenticado.
   * @returns {JSX.Element} Um fragmento com os links e informações do usuário.
   */
  const renderAuthenticatedActions = () => (
    <>
      {renderAdminJornalistaLinks()}
      {renderAdminLinks()}
      {renderUserInfo()}
    </>
  );

  /**
   * @description Agrupa e renderiza as ações para um visitante (não autenticado).
   * @returns {JSX.Element} Um fragmento com os links de login e cadastro.
   */
  const renderVisitorActions = () => (
    <>
      <Link to={ROUTE.LOGIN} className="nav-btn nav-btn-login">
        <i className="fas fa-sign-in-alt" /> Login
      </Link>
      <Link to={ROUTE.REGISTER_USER} className="nav-btn nav-btn-register">
        <i className="fas fa-user-plus" /> Cadastrar
      </Link>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={ROUTE.HOME} className="navbar-logo">
          <i className="fas fa-newspaper" /> {LOGO_TEXT}
        </Link>
        <div className="nav-user-actions">
          {user ? renderAuthenticatedActions() : renderVisitorActions()}
        </div>
        {/* // TODO: Implementar a lógica do menu hamburguer para dispositivos móveis. */}
        <div className="menu-icon">
          <i className="fas fa-bars" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
