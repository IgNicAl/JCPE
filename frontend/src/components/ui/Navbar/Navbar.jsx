import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import { userService } from '@/lib/api';
import logo from '../../../assets/logo.svg';
import NextPoint from '../NextPoint/NextPoint';
import './Navbar.css';

const ROUTE = {
  HOME: '/',
  MANAGE_NEWS: '/noticias/gerenciar',
  MANAGE_USERS: '/users',
  LOGIN: '/login',
  REGISTER_USER: '/cadastro',
  CHAT_AI: '/chat', // <-- Adicionada rota do chat
};
const LOGO_TEXT = 'JCPM News';

/**
 * Componente de navegação principal da aplicação.
 * Inclui o logo, links de navegação, botões de autenticação
 * e o menu do usuário (avatar).
 * * @returns {JSX.Element} A barra de navegação.
 */
function Navbar() {
  const { user, logout, isAdmin, isJournalist } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setMenuOpen(false);

  // Efeito para buscar a URL do avatar do usuário (se disponível)
  useEffect(()=>{
    let mounted = true;
    async function load() {
      try{
        const res = await userService.getMyProfile();
        if(!mounted) return;
        const data = res.data || {};
        setAvatarUrl(data.avatarUrl || data.photoUrl || data.photo || null);
      }catch(e){
        // ignora
      }
    }
    if(user){
      load();
      const local = localStorage.getItem('jcpm_avatar');
      if(local){
        setAvatarUrl(local);
      }
    }
    return ()=>{ mounted = false };
  },[user]);

  // Efeito para fechar o dropdown do avatar se clicar fora dele
  const handleDocumentClick = (e)=>{
    if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
      setDropdownOpen(false);
    }
  }
  useEffect(()=>{
    if(dropdownOpen){
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }
    return ()=> document.removeEventListener('click', handleDocumentClick);
  },[dropdownOpen]);

  /**
   * Renderiza o menu do avatar (dropdown) para usuários logados.
   */
  const renderAuthenticatedActions = () => {
    const initials = (user?.name || user?.username || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
    return (
      <div className="avatar-wrapper" ref={dropdownRef}>
        <button className="avatar-button" onClick={()=>setDropdownOpen(!dropdownOpen)} aria-label="menu do usuário">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="avatar-img" />
          ) : (
            <div className="avatar-initials">{initials}</div>
          )}
        </button>
        {dropdownOpen && (
          <div className="avatar-dropdown">
            <Link to="/usuario" className="avatar-dropdown-item" onClick={()=>{setDropdownOpen(false); closeMobileMenu()}}>Meu dados</Link>
            <Link to="/pontos" className="avatar-dropdown-item" onClick={()=>{setDropdownOpen(false); closeMobileMenu()}}>Meus benefícios</Link>
            <button className="avatar-dropdown-item avatar-logout" onClick={()=>{ setDropdownOpen(false); logout(); }}>Sair</button>
          </div>
        )}
      </div>
    )
  };

  /**
   * Renderiza os botões de Login e Cadastro para visitantes.
   */
  const renderVisitorActions = () => (
    <>
      <Link to={ROUTE.LOGIN} className="nav-btn nav-btn-login" onClick={closeMobileMenu}>
        LOGIN
      </Link>
      <Link to={ROUTE.REGISTER_USER} className="nav-btn nav-btn-register" onClick={closeMobileMenu}>
        CADASTRO
      </Link>
    </>
  );

  return (
    <nav className="navbar">
      {/* Seção Superior: Logo e Autenticação */}
      <div className="navbar-top">
        <Link to={ROUTE.HOME} className="navbar-logo-container" onClick={closeMobileMenu}>
          <img src={logo} alt="JCPM Logo" className="navbar-logo-img" />
        </Link>
        <div className="nav-auth">
          {user && <NextPoint />}
          {user ? renderAuthenticatedActions() : renderVisitorActions()}
        </div>
      </div>

      {/* Seção Inferior: Menu de Navegação e Pesquisa */}
      <div className="navbar-bottom">
        <div className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <Link to="/" className="nav-menu-item" onClick={closeMobileMenu}>SOBRE</Link>
          <Link to="/noticias" className="nav-menu-item" onClick={closeMobileMenu}>NOTÍCIAS</Link>

          {/* NOVO LINK: Assistente de IA
            Aparece apenas se o usuário estiver logado.
          */}
          {user && (
            <Link to={ROUTE.CHAT_AI} className="nav-menu-item" onClick={closeMobileMenu}>
              <i className="fas fa-robot" style={{marginRight: '6px', opacity: 0.8}}></i>
              ASSISTENTE IA
            </Link>
          )}

          <Link to="/recife" className="nav-menu-item" onClick={closeMobileMenu}>RECIFE EM 5 MIN</Link>
          <Link to="/jogos" className="nav-menu-item" onClick={closeMobileMenu}>JOGOS</Link>
          <Link to="/clima" className="nav-menu-item" onClick={closeMobileMenu}>CLIMA</Link>
          <Link to="/empreendedorismo" className="nav-menu-item" onClick={closeMobileMenu}>EMPREENDEDORISMO</Link>

          {/* Links de Admin/Jornalista (condicionais) */}
          {user && isAdmin() && (
            <Link to={ROUTE.MANAGE_NEWS} className="nav-menu-item nav-menu-admin" onClick={closeMobileMenu}>
              GERENCIAR NOTÍCIAS
            </Link>
          )}
          {user && isAdmin() && (
            <Link to={ROUTE.MANAGE_USERS} className="nav-menu-item nav-menu-admin" onClick={closeMobileMenu}>
              GERENCIAR USUÁRIOS
            </Link>
          )}
          {user && isJournalist() && (
            <Link to={ROUTE.MANAGE_NEWS} className="nav-menu-item nav-menu-journalist" onClick={closeMobileMenu}>
              MINHAS NOTÍCIAS
            </Link>
          )}
        </div>

        {/* Barra de Pesquisa */}
        <div className="navbar-search">
          <input type="text" placeholder="PESQUISAR" className="search-input" />
          <button type="button" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Ícone de Menu Hamburguer (Mobile) */}
      <div className="menu-icon" onClick={toggleMenu}>
        <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
      </div>
    </nav>
  );
}

export default Navbar;
