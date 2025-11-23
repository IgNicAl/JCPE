import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/services/api';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import { User, UserType } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import './UserList.css';

interface UserListItem extends User {
  urlImagemPerfil?: string;
  biography?: string;
}

interface UserTypeInfo {
  label: string;
  icon: string;
}

type FilterType = 'all' | 'admin' | 'journalist' | 'reviewer' | 'user';

/**
 * @description Página para administradores gerenciarem todos os usuários do sistema.
 * Permite visualizar, criar, editar e excluir usuários.
 */
const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.user;
  const navigate = useNavigate();

  /**
   * @description Carrega a lista de usuários da API.
   */
  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers();
      setUsers(response.data as UserListItem[]);
    } catch (err) {
      setError('Erro ao carregar usuários. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * @description Abre o modal de confirmação para excluir um usuário.
   * @param {string} id O ID do usuário a ser excluído.
   */
  const handleDeleteClick = (id: string): void => {
    if (!currentUser) return;

    // Regra de negócio: Impede que o administrador exclua a própria conta.
    if (id === currentUser.id) {
      alert('Você não pode excluir sua própria conta!');
      return;
    }

    setDeleteId(id); // Abre o modal de confirmação
  };

  /**
   * @description Executa a exclusão do usuário após confirmação.
   */
  const confirmDelete = async (): Promise<void> => {
    if (!deleteId) return;

    try {
      setDeletingId(deleteId);
      await userService.deleteUser(deleteId);
      await loadUsers(); // Recarrega a lista após a exclusão.
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      alert('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setDeletingId(null);
      setDeleteId(null); // Fecha o modal
    }
  };


  const handleEdit = (id: string): void => {
    navigate(`/painel/usuarios/editar/${id}`);
  };

  const getUserTypeLabel = (userType: UserType): UserTypeInfo => {
    switch (userType) {
      case 'ADMIN':
        return { label: 'Administrador', icon: 'fa-user-shield' };
      case 'JOURNALIST':
        return { label: 'Jornalista', icon: 'fa-user-tie' };
      case 'REVIEWER':
        return { label: 'Revisor', icon: 'fa-clipboard-check' };
      case 'USER':
        return { label: 'Usuário Padrão', icon: 'fa-user' };
      default:
        return { label: 'Desconhecido', icon: 'fa-user' };
    }
  };

  /**
   * @description Filtra e busca usuários baseado nos critérios selecionados.
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filtro de busca
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de tipo
      const matchesType = filterType === 'all' ||
        user.userType.toLowerCase() === filterType;

      return matchesSearch && matchesType;
    });
  }, [users, searchTerm, filterType]);

  /**
   * @description Calcula estatísticas dos usuários.
   */
  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter(u => u.userType === 'ADMIN').length,
      journalists: users.filter(u => u.userType === 'JOURNALIST').length,
      reviewers: users.filter(u => u.userType === 'REVIEWER').length,
      regularUsers: users.filter(u => u.userType === 'USER').length,
    };
  }, [users]);

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="user-list-loading">
          <div className="spinner-wrapper">
            <i className="fas fa-spinner fa-spin" />
          </div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="user-list-error">
          <i className="fas fa-exclamation-circle" />
          <p>{error}</p>
          <button type="button" onClick={loadUsers} className="retry-btn">
            <i className="fas fa-sync-alt" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      {/* Header */}
      <div className="user-list-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-users" />
            <span>Gerenciar Usuários</span>
          </h1>
          <p className="subtitle">Gerencie todos os usuários do sistema</p>
        </div>
        <button type="button" onClick={() => navigate('/cadastro-admin')} className="create-user-btn">
          <i className="fas fa-user-plus" />
          Novo Usuário
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-users-slash" />
          </div>
          <h2>Nenhum usuário cadastrado</h2>
          <p>Comece adicionando o primeiro usuário ao sistema</p>
          <button type="button" onClick={() => navigate('/cadastro-admin')} className="create-first-btn">
            <i className="fas fa-user-plus" />
            Cadastrar Primeiro Usuário
          </button>
        </div>
      ) : (
        <>
          {/* Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-users" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total de Usuários</span>
              </div>
            </div>
            <div className="stat-card admin">
              <div className="stat-icon">
                <i className="fas fa-user-shield" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.admins}</span>
                <span className="stat-label">Administradores</span>
              </div>
            </div>
            <div className="stat-card journalist">
              <div className="stat-icon">
                <i className="fas fa-user-tie" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.journalists}</span>
                <span className="stat-label">Jornalistas</span>
              </div>
            </div>
            <div className="stat-card reviewer">
              <div className="stat-icon">
                <i className="fas fa-clipboard-check" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.reviewers}</span>
                <span className="stat-label">Revisores</span>
              </div>
            </div>

            <div className="stat-card user">
              <div className="stat-icon">
                <i className="fas fa-user" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.regularUsers}</span>
                <span className="stat-label">Usuários Padrão</span>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" className="clear-search" onClick={() => setSearchTerm('')} aria-label="Limpar busca">
                  <i className="fas fa-times" />
                </button>
              )}
            </div>

            <div className="filter-buttons">
              <button
                type="button"
                className={filterType === 'all' ? 'active' : ''}
                onClick={() => setFilterType('all')}
              >
                <i className="fas fa-th" />
                Todos
              </button>
              <button
                type="button"
                className={filterType === 'admin' ? 'active admin-filter' : 'admin-filter'}
                onClick={() => setFilterType('admin')}
              >
                <i className="fas fa-user-shield" />
                Administradores
              </button>
              <button
                type="button"
                className={filterType === 'journalist' ? 'active journalist-filter' : 'journalist-filter'}
                onClick={() => setFilterType('journalist')}
              >
                <i className="fas fa-user-tie" />
                Jornalistas
              </button>
              <button
                type="button"
                className={filterType === 'reviewer' ? 'active reviewer-filter' : 'reviewer-filter'}
                onClick={() => setFilterType('reviewer')}
              >
                <i className="fas fa-clipboard-check" />
                Revisores
              </button>
              <button
                type="button"
                className={filterType === 'user' ? 'active user-filter' : 'user-filter'}
                onClick={() => setFilterType('user')}
              >
                <i className="fas fa-user" />
                Usuários
              </button>
            </div>
          </div>

          {/* Lista de Usuários */}
          {filteredUsers.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search" />
              <p>Nenhum usuário encontrado com os filtros selecionados</p>
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map((user) => {
                const userTypeInfo = getUserTypeLabel(user.userType);
                const isCurrentUser = user.id === currentUser?.id;

                return (
                  <div key={user.id} className={`user-card ${isCurrentUser ? 'current-user' : ''}`}>
                    <div className="user-avatar">
                      {user.urlImagemPerfil ? (
                        <img src={user.urlImagemPerfil} alt={user.name} />
                      ) : (
                        <i className="fas fa-user" />
                      )}
                      {isCurrentUser && (
                        <span className="current-badge">Você</span>
                      )}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="user-username">@{user.username || user.email}</p>
                      <p className="user-email">
                        <i className="fas fa-envelope" />
                        {user.email}
                      </p>
                      <span className={`user-type ${user.userType.toLowerCase()}`}>
                        <i className={`fas ${userTypeInfo.icon}`} />
                        {userTypeInfo.label}
                      </span>
                    </div>
                    <div className="user-actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(user.id || '')}
                        className="btn-action edit"
                      >
                        <i className="fas fa-edit" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(user.id || '')}
                        className="btn-action delete"
                        disabled={deletingId === user.id || isCurrentUser}
                        title={isCurrentUser ? 'Você não pode excluir sua própria conta' : 'Excluir usuário'}
                      >
                        {deletingId === user.id ? (
                          <>
                            <i className="fas fa-spinner fa-spin" />
                            Excluindo...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-trash-alt" />
                            Excluir
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal de Confirmação */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default UserList;


