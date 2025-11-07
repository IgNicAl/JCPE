import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/services/api';
import Avatar from '@/components/atoms/Avatar';
import Dropdown from '@/components/molecules/Dropdown';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ROUTES } from '@/utils/constants';
import styles from './UserMenu.module.css';

/**
 * Componente UserMenu para menu do usuário logado
 */
function UserMenu({ onItemClick }) {
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setDropdownOpen(false));

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await userService.getMyProfile();
        if (!mounted) return;
        const data = res.data || {};
        setAvatarUrl(data.avatarUrl || data.photoUrl || data.photo || null);
      } catch (e) {
        // ignora
      }
    }
    if (user) {
      load();
      const local = localStorage.getItem('jcpe_avatar');
      if (local) {
        setAvatarUrl(local);
      }
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

  if (!user) return null;

  return (
    <div className={styles.userMenu} ref={dropdownRef}>
      <button
        className={styles.avatarButton}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="menu do usuário"
      >
        <Avatar src={avatarUrl} name={user.name || user.username} size="md" />
      </button>
      <Dropdown isOpen={dropdownOpen} align="right">
        <Link
          to={ROUTES.USER_AREA}
          className={styles.dropdownItem}
          onClick={handleItemClick}
        >
          Meus dados
        </Link>
        <Link
          to={ROUTES.POINTS}
          className={styles.dropdownItem}
          onClick={handleItemClick}
        >
          Meus benefícios
        </Link>
        <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
          Sair
        </button>
      </Dropdown>
    </div>
  );
}

UserMenu.propTypes = {
  onItemClick: PropTypes.func,
};

export default UserMenu;

