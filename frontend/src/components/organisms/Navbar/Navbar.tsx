import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { ROUTES } from '@/utils/constants';
import logo from '@/assets/logo.svg';
import NextPoint from '@/components/molecules/NextPoint';
import UserMenu from '@/components/organisms/UserMenu';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import NotificationIcon from '@/components/atoms/NotificationIcon';
import MegaMenuCategories from '@/components/molecules/MegaMenuCategories';
import DropdownPages from '@/components/molecules/DropdownPages';
import styles from './Navbar.module.css';

const SCROLL_THRESHOLD = 50;

/**
 * Navbar redesenhado seguindo o design do Figma
 * Layout horizontal com mega menu de categorias, páginas, busca e ferramentas
 * Transforma-se numa "Island Navbar" ao fazer scroll.
 */
const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isScrolled, setScrolled] = useState<boolean>(false);
  const [notificationCount] = useState<number>(3); // TODO: integrar com sistema real de notificações
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const handleNotificationClick = () => {
    // TODO: abrir painel de notificações
    console.log('Notificações clicadas');
  };

  const renderVisitorActions = () => (
    <div className={styles.authButtons}>
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
    </div>
  );

  const navbarContainerClasses = `${styles.navbarContainer} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <nav className={styles.navbar}>
      <div className={navbarContainerClasses}>
        <Link to={ROUTES.HOME} className={styles.logoContainer} onClick={closeMobileMenu}>
          <img src={logo} alt="JCPE Logo" className={styles.logoImg} />
        </Link>

        <div className={styles.navContentWrapper}>
          <div className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
            <ThemeToggle className={styles.themeToggle} />
            <MegaMenuCategories onItemClick={closeMobileMenu} />
            <DropdownPages onItemClick={closeMobileMenu} />
            <Link to="/contato" className={styles.navLink} onClick={closeMobileMenu}>
              Contato
            </Link>
            <Link to="/sobre" className={styles.navLink} onClick={closeMobileMenu}>
              Sobre
            </Link>
          </div>

          <div className={styles.navRightSection}>
            <SearchBar className={styles.searchBar} />
            {user && <NextPoint />}
            {user ? (
              <>
                <UserMenu onItemClick={closeMobileMenu} />
                <NotificationIcon count={notificationCount} onClick={handleNotificationClick} />
              </>
            ) : (
              renderVisitorActions()
            )}
          </div>
        </div>

        <button
          className={styles.menuIcon}
          onClick={toggleMenu}
          aria-label="Menu de navegação"
          aria-expanded={isMenuOpen}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <ThemeToggle className={styles.themeToggle} />
          <MegaMenuCategories onItemClick={closeMobileMenu} />
          <DropdownPages onItemClick={closeMobileMenu} />
          <Link to="/contato" className={styles.mobileMenuItem} onClick={closeMobileMenu}>
            Contato
          </Link>
          <Link to="/sobre" className={styles.mobileMenuItem} onClick={closeMobileMenu}>
            Sobre
          </Link>

          {!user && (
            <div className={styles.mobileAuthButtons}>
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
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

