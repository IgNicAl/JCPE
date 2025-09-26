import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/lib/api';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import './ListaUsuarios.css';

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers();
      setUsuarios(response.data);
    } catch (error) {
      setError('Erro ao carregar usuários. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === user.id) {
      alert('Você não pode excluir sua própria conta!');
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      setDeletingId(id);
      await userService.deleteUser(id);
      await carregarUsuarios();
    } catch (error) {
      alert('Erro ao excluir usuário. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="lista-usuarios-container">
        <div className="lista-usuarios-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-usuarios-container">
        <div className="lista-usuarios-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={carregarUsuarios} className="retry-btn">
            <i className="fas fa-sync-alt"></i>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-usuarios-container">
      <div className="lista-usuarios-header">
        <h1><i className="fas fa-users"></i> Gerenciar Usuários</h1>
        <button
          onClick={() => navigate('/cadastro-admin')}
          className="criar-usuario-btn"
        >
          <i className="fas fa-user-plus"></i>
          Novo Usuário
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div className="sem-usuarios">
          <i className="fas fa-users-slash"></i>
          <p>Nenhum usuário cadastrado.</p>
          <button
            onClick={() => navigate('/cadastro-admin')}
            className="criar-primeiro-btn"
          >
            <i className="fas fa-user-plus"></i>
            Cadastrar Primeiro Usuário
          </button>
        </div>
      ) : (
        <div className="usuarios-grid">
          {usuarios.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-avatar">
                {usuario.urlImagemPerfil ? (
                  <img src={usuario.urlImagemPerfil} alt={usuario.nome} />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div className="usuario-info">
                <h3>{usuario.nome}</h3>
                <p className="usuario-username">@{usuario.username}</p>
                <p className="usuario-email">
                  <i className="fas fa-envelope"></i>
                  {usuario.email}
                </p>
                <span className={`usuario-tipo ${usuario.tipoUsuario.toLowerCase()}`}>
                  <i className={`fas ${usuario.tipoUsuario === 'ADMIN' ? 'fa-user-shield' : 'fa-user'}`}></i>
                  {usuario.tipoUsuario === 'ADMIN' ? 'Administrador' : 'Jornalista'}
                </span>
              </div>
              <div className="usuario-actions">
                <button
                  onClick={() => handleDelete(usuario.id)}
                  className="delete-btn"
                  disabled={deletingId === usuario.id || usuario.id === user.id}
                >
                  {deletingId === usuario.id ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash-alt"></i>
                      Excluir
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaUsuarios;
