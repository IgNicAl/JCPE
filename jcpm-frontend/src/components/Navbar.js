import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <i className="fas fa-users"></i>
          <span>JCPM</span>
        </div>
        
        <div className="navbar-menu">
          {
            /* Home visível para todos */
          }
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            Início
          </Link>
          {isAuthenticated() ? (
            <>
              
              <Link 
                to="/cadastro" 
                className={`navbar-link ${location.pathname === '/cadastro' ? 'active' : ''}`}
              >
                <i className="fas fa-user-plus"></i>
                Cadastro
              </Link>
              
              <Link 
                to="/usuarios" 
                className={`navbar-link ${location.pathname === '/usuarios' ? 'active' : ''}`}
              >
                <i className="fas fa-list"></i>
                Usuários
              </Link>
              
              <div className="navbar-user">
                <span className="user-info">
                  <i className="fas fa-user"></i>
                  {user?.nome || user?.email}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <i className="fas fa-sign-out-alt"></i>
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
              
              <Link 
                to="/cadastro" 
                className={`navbar-link ${location.pathname === '/cadastro' ? 'active' : ''}`}
              >
                <i className="fas fa-user-plus"></i>
                Cadastro
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
