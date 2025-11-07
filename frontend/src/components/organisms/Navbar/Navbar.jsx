import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { ROUTES } from '@/utils/constants';
import logo from '@/assets/logo.svg';
import NextPoint from '@/components/molecules/NextPoint';
import UserMenu from '@/components/organisms/UserMenu';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import styles from './Navbar.module.css';

/**
 * Componente de navegação principal da aplicação.
 * Inclui o logo, links de navegação, botões de autenticação
 * e o menu do usuário (avatar).
 */
function Navbar() {
  const { user, isAdmin, isJournalist } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const renderVisitorActions = () => (
    <>
      <Link to={ROUTES.LOGIN} onClick={closeMobileMenu}>
        <Button variant="secondary" className={styles.navBtnLogin}>
          LOGIN
        </Button>
      </Link>
      <Link to={ROUTES.REGISTER} onClick={closeMobileMenu}>
        <Button variant="secondary" className={styles.navBtnRegister}>
          CADASTRO
        </Button>
      </Link>
    </>
  );

  return (
    <nav className={styles.navbar}>
      {/* Seção Superior: Logo e Autenticação */}
      <div className={styles.navbarTop}>
        <Link to={ROUTES.HOME} className={styles.logoContainer} onClick={closeMobileMenu}>
          <img src={logo} alt="jcpe Logo" className={styles.logoImg} />
        </Link>
        <div className={styles.navAuth}>
          {user && <NextPoint />}
          {user ? <UserMenu onItemClick={closeMobileMenu} /> : renderVisitorActions()}
        </div>
      </div>

      {/* Seção Inferior: Menu de Navegação e Pesquisa */}
      <div className={styles.navbarBottom}>
        <div className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
          <Link to="/" className={styles.navMenuItem} onClick={closeMobileMenu}>
            SOBRE
          </Link>
          <Link to="/noticias" className={styles.navMenuItem} onClick={closeMobileMenu}>
            NOTÍCIAS
          </Link>

          {user && (
            <Link to={ROUTES.CHAT_AI} className={styles.navMenuItem} onClick={closeMobileMenu}>
              <Icon name="fa-robot" size="sm" /> ASSISTENTE IA
            </Link>
          )}

          <Link to="/recife" className={styles.navMenuItem} onClick={closeMobileMenu}>
            RECIFE EM 5 MIN
          </Link>
          <Link to="/jogos" className={styles.navMenuItem} onClick={closeMobileMenu}>
            JOGOS
          </Link>
          <Link to="/clima" className={styles.navMenuItem} onClick={closeMobileMenu}>
            CLIMA
          </Link>
          <Link
            to="/empreendedorismo"
            className={styles.navMenuItem}
            onClick={closeMobileMenu}
          >
            EMPREENDEDORISMO
          </Link>

          {user && isAdmin() && (
            <Link
              to={ROUTES.MANAGE_NEWS}
              className={`${styles.navMenuItem} ${styles.navMenuAdmin}`}
              onClick={closeMobileMenu}
            >
              GERENCIAR NOTÍCIAS
            </Link>
          )}
          {user && isAdmin() && (
            <Link
              to={ROUTES.MANAGE_USERS}
              className={`${styles.navMenuItem} ${styles.navMenuAdmin}`}
              onClick={closeMobileMenu}
            >
              GERENCIAR USUÁRIOS
            </Link>
          )}
          {user && isJournalist() && (
            <Link
              to={ROUTES.MANAGE_NEWS}
              className={`${styles.navMenuItem} ${styles.navMenuJournalist}`}
              onClick={closeMobileMenu}
            >
              MINHAS NOTÍCIAS
            </Link>
          )}
        </div>

        <SearchBar className={styles.searchBar} />
      </div>

      {/* Ícone de Menu Hamburguer (Mobile) */}
      <div className={styles.menuIcon} onClick={toggleMenu}>
        <Icon name={isMenuOpen ? 'fa-times' : 'fa-bars'} />
      </div>
    </nav>
  );
}

export default Navbar;
