import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isJornalista } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-newspaper"></i> JCPM News
        </Link>

        <div className="nav-user-actions">
          {user ? (
            <>
              {/* Botões para Admin e Jornalista */}
              {(isAdmin() || isJornalista()) && (
                <Link to="/noticias/gerenciar" className="nav-btn nav-btn-admin">
                  <i className="fas fa-edit"></i> Gerenciar Notícias
                </Link>
              )}

              {/* Botão exclusivo para Admin */}
              {isAdmin() && (
                <Link to="/usuarios" className="nav-btn nav-btn-admin">
                  <i className="fas fa-users-cog"></i> Gerenciar Usuários
                </Link>
              )}

              <div className="nav-user-info">
                <span className="nav-welcome">
                  Olá, <strong>{user.nome}</strong>
                </span>
                <button onClick={logout} className="nav-btn nav-btn-logout">
                  <i className="fas fa-sign-out-alt"></i> Sair
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Botões para visitantes */}
              <Link to="/login" className="nav-btn nav-btn-login">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link to="/cadastro-interno" className="nav-btn nav-btn-register">
                <i className="fas fa-user-plus"></i> Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* Menu Hamburguer para telas menores (opcional) */}
        <div className="menu-icon">
          <i className="fas fa-bars" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;