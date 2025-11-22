import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/services/api';
import Avatar from '@/components/atoms/Avatar';
import Dropdown from '@/components/molecules/Dropdown';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ROUTES } from '@/utils/constants';
import styles from './UserMenu.module.css';

/**
 * Componente UserMenu expandido com opções de gerenciamento
 */
interface UserMenuProps {
  onItemClick?: () => void;
  showName?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onItemClick, showName = true }) => {
  const { user, logout, isAdmin, isJournalist, isReviewer } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setDropdownOpen(false));

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await userService.getMyProfile();
        if (!mounted) return;
        const data = res.data || {};
        // Usa o campo correto urlImagemPerfil (mesmo usado na página de gerenciar usuários)
        const apiAvatarUrl = data.urlImagemPerfil || data.avatarUrl || data.photoUrl || data.photo || null;

        if (apiAvatarUrl && typeof apiAvatarUrl === 'string' && apiAvatarUrl.trim() !== '') {
          setAvatarUrl(apiAvatarUrl);
          return;
        }

        // Se a API não retornou, tenta usar o localStorage como fallback
        const local = localStorage.getItem('jcpe_avatar');
        if (local && local.trim() !== '') {
          setAvatarUrl(local);
        } else {
          setAvatarUrl(null);
        }
      } catch (e) {
        // Em caso de erro, tenta usar o localStorage como fallback
        if (!mounted) return;
        const local = localStorage.getItem('jcpe_avatar');
        if (local && local.trim() !== '') {
          setAvatarUrl(local);
        } else {
          setAvatarUrl(null);
        }
      }
    }
    if (user) {
      load();
    } else {
      setAvatarUrl(null);
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleItemClick = () => {
    setDropdownOpen(false);
    if (onItemClick) onItemClick();
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  if (!user) return null;

  const userName = user.name || user.email?.split('@')[0] || 'Usuário';
  const canManageNews = isAdmin() || isJournalist();
  const canReview = isAdmin() || isReviewer();
  const canManageUsers = isAdmin();

  return (
    <div className={styles.userMenu} ref={dropdownRef}>
      <button
        className={styles.userButton}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-label="Menu do usuário"
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        aria-haspopup="true"
      >
        <Avatar src={avatarUrl || undefined} name={userName} size="md" />
        {showName && <span className={styles.userName}>{userName}</span>}
        <i className={`fas fa-chevron-down ${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
      </button>

      <Dropdown isOpen={dropdownOpen} align="right">
        <div className={styles.dropdownHeader}>
          <Avatar src={avatarUrl || undefined} name={userName} size="sm" />
          <div className={styles.userInfo}>
            <span className={styles.userNameHeader}>{userName}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
        </div>

        <div className={styles.dropdownDivider} />

        <Link
          to={ROUTES.PROFILE}
          className={styles.dropdownItem}
          onClick={handleItemClick}
        >
          <i className="fas fa-user" />
          <span>Perfil</span>
        </Link>

        <Link
          to={ROUTES.PROFILE}
          className={styles.dropdownItem}
          onClick={handleItemClick}
        >
          <i className="fas fa-id-card" />
          <span>Área do Usuário</span>
        </Link>

        {user.userType === 'USER' && (
          <Link
            to={ROUTES.POINTS}
            className={styles.dropdownItem}
            onClick={handleItemClick}
          >
            <i className="fas fa-gift" />
            <span>Meus Benefícios</span>
          </Link>
        )}

        {canManageNews && (
          <>
            <div className={styles.dropdownDivider} />
            <div className={styles.dropdownSection}>Gerenciamento</div>
            <Link
              to={ROUTES.MANAGE_NEWS}
              className={`${styles.dropdownItem} ${styles.managementItem}`}
              onClick={handleItemClick}
            >
              <i className="fas fa-newspaper" />
              <span>Gerenciar Notícias</span>
            </Link>
          </>
        )}

        {canReview && (
          <Link
            to="/admin/revisao"
            className={`${styles.dropdownItem} ${styles.managementItem}`}
            onClick={handleItemClick}
          >
            <i className="fas fa-clipboard-check" />
            <span>Painel de Revisão</span>
          </Link>
        )}

        {canManageUsers && (
          <Link
            to={ROUTES.MANAGE_USERS}
            className={`${styles.dropdownItem} ${styles.managementItem}`}
            onClick={handleItemClick}
          >
            <i className="fas fa-users-cog" />
            <span>Gerenciar Usuários</span>
          </Link>
        )}

        <div className={styles.dropdownDivider} />

        <Link
          to="/configuracoes"
          className={styles.dropdownItem}
          onClick={handleItemClick}
        >
          <i className="fas fa-cog" />
          <span>Configurações</span>
        </Link>

        <button
          className={`${styles.dropdownItem} ${styles.logout}`}
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt" />
          <span>Sair</span>
        </button>
      </Dropdown>
    </div>
  );
};

export default UserMenu;

