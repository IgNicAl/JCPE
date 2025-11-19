import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/services/api';
import Avatar from '@/components/atoms/Avatar';
import Dropdown from '@/components/molecules/Dropdown';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ROUTES } from '@/utils/constants';

/**
 * Componente UserMenu expandido com opções de gerenciamento
 */
interface UserMenuProps {
  onItemClick?: () => void;
  showName?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onItemClick, showName = true }) => {
  const { user, logout, isAdmin, isJournalist } = useAuth();
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
  const canManageUsers = isAdmin();

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        className="inline-flex items-center gap-sm p-0 sm:p-1 bg-transparent border-none cursor-pointer transition-all duration-normal hover:opacity-85 focus:outline-2 focus:outline-primary focus:outline-offset-2 focus:rounded-md"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-label="Menu do usuário"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <Avatar src={avatarUrl || undefined} name={userName} size="md" />
        {showName && <span className="text-text-primary dark:text-text-primary text-base lg:text-sm sm:hidden font-roboto font-medium capitalize whitespace-nowrap max-w-[120px] lg:max-w-[100px] overflow-hidden text-ellipsis">{userName}</span>}
        <i className={`fas fa-chevron-down text-sm text-text-tertiary dark:text-text-tertiary transition-transform duration-normal sm:hidden ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      <Dropdown isOpen={dropdownOpen} align="right">
        <div className="flex items-center gap-[10px] p-4 bg-bg-secondary dark:bg-bg-secondary rounded-t-md -m-2 -mt-2 mb-0">
          <Avatar src={avatarUrl || undefined} name={userName} size="sm" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-text-primary dark:text-text-primary text-sm font-roboto font-bold whitespace-nowrap overflow-hidden text-ellipsis">{userName}</span>
            <span className="text-text-secondary dark:text-text-secondary text-xs font-roboto font-regular whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</span>
          </div>
        </div>

        <div className="h-px bg-border-color dark:bg-border-color my-2" />

        <Link
          to={ROUTES.USER_AREA}
          className="flex items-center gap-3 px-[14px] py-2.5 no-underline text-text-primary dark:text-text-primary text-sm font-roboto font-medium border-none bg-transparent w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-bg-secondary dark:hover:bg-bg-secondary hover:text-primary dark:hover:text-primary-light [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-text-tertiary dark:[&>i]:text-text-tertiary [&>i]:transition-all [&>i]:duration-normal hover:[&>i]:text-primary dark:hover:[&>i]:text-primary [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
          onClick={handleItemClick}
        >
          <i className="fas fa-user" />
          <span>Perfil</span>
        </Link>

        <Link
          to={ROUTES.USER_AREA}
          className="flex items-center gap-3 px-[14px] py-2.5 no-underline text-text-primary dark:text-text-primary text-sm font-roboto font-medium border-none bg-transparent w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-bg-secondary dark:hover:bg-bg-secondary hover:text-primary dark:hover:text-primary-light [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-text-tertiary dark:[&>i]:text-text-tertiary [&>i]:transition-all [&>i]:duration-normal hover:[&>i]:text-primary dark:hover:[&>i]:text-primary [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
          onClick={handleItemClick}
        >
          <i className="fas fa-id-card" />
          <span>Área do Usuário</span>
        </Link>

        <Link
          to={ROUTES.POINTS}
          className="flex items-center gap-3 px-[14px] py-2.5 no-underline text-text-primary dark:text-text-primary text-sm font-roboto font-medium border-none bg-transparent w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-bg-secondary dark:hover:bg-bg-secondary hover:text-primary dark:hover:text-primary-light [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-text-tertiary dark:[&>i]:text-text-tertiary [&>i]:transition-all [&>i]:duration-normal hover:[&>i]:text-primary dark:hover:[&>i]:text-primary [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
          onClick={handleItemClick}
        >
          <i className="fas fa-gift" />
          <span>Meus Benefícios</span>
        </Link>

        {canManageNews && (
          <>
            <div className="h-px bg-border-color dark:bg-border-color my-2" />
            <div className="text-text-tertiary dark:text-text-tertiary text-[11px] font-roboto font-bold uppercase tracking-wider px-[14px] py-2 pb-1">Gerenciamento</div>
            <Link
              to={ROUTES.MANAGE_NEWS}
              className="flex items-center gap-3 px-[14px] py-2.5 no-underline text-text-primary dark:text-text-primary text-sm font-roboto font-medium border-none bg-secondary-overlay-light dark:bg-secondary-overlay-medium w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-secondary-overlay-medium dark:hover:bg-secondary-overlay-heavy hover:text-primary dark:hover:text-primary-light [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-secondary-dark dark:[&>i]:text-secondary-dark [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
              onClick={handleItemClick}
            >
              <i className="fas fa-newspaper" />
              <span>Gerenciar Notícias</span>
            </Link>
          </>
        )}

        {canManageUsers && (
          <Link
            to={ROUTES.MANAGE_USERS}
            className="flex items-center gap-3 px-[14px] py-2.5 no-underline text-text-primary dark:text-text-primary text-sm font-roboto font-medium border-none bg-secondary-overlay-light dark:bg-secondary-overlay-medium w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-secondary-overlay-medium dark:hover:bg-secondary-overlay-heavy hover:text-primary dark:hover:text-primary-light [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-secondary-dark dark:[&>i]:text-secondary-dark [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
            onClick={handleItemClick}
          >
            <i className="fas fa-users-cog" />
            <span>Gerenciar Usuários</span>
          </Link>
        )}

        <div className="h-px bg-border-color dark:bg-border-color my-2" />

        <Link
          to="/configuracoes"
          className="flex items-center gap-3 px-[14px] py-2.5 no-underline text-text-primary dark:text-text-primary text-sm font-roboto font-medium border-none bg-transparent w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-bg-secondary dark:hover:bg-bg-secondary hover:text-primary dark:hover:text-primary-light [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-text-tertiary dark:[&>i]:text-text-tertiary [&>i]:transition-all [&>i]:duration-normal hover:[&>i]:text-primary dark:hover:[&>i]:text-primary [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
          onClick={handleItemClick}
        >
          <i className="fas fa-cog" />
          <span>Configurações</span>
        </Link>

        <button
          className="flex items-center gap-3 px-[14px] py-2.5 text-error dark:text-error-dark text-sm font-roboto font-bold border-none bg-transparent w-full text-left cursor-pointer transition-all duration-normal rounded-md hover:bg-error-overlay-light dark:hover:bg-error-overlay-light hover:text-error dark:hover:text-error-dark [&>i]:w-4 [&>i]:text-sm [&>i]:text-center [&>i]:text-error dark:[&>i]:text-error-dark [&>span]:flex-1 focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
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

