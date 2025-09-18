import React, { useState, useEffect } from 'react';
import { usuarioService } from '../services/api';
import './ListaUsuarios.css';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAllUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erro ao carregar usuários.' 
      });
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return 'Não informado';
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const formatarSexo = (sexo) => {
    const sexos = {
      'M': 'Masculino',
      'F': 'Feminino',
      'O': 'Outro'
    };
    return sexos[sexo] || 'Não informado';
  };

  if (loading) {
    return (
      <div className="lista-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h1><i className="fas fa-users"></i> Lista de Usuários</h1>
        <button onClick={carregarUsuarios} className="refresh-btn">
          <i className="fas fa-sync-alt"></i> Atualizar
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {message.text}
        </div>
      )}

      {usuarios.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-user-slash"></i>
          <h3>Nenhum usuário encontrado</h3>
          <p>Não há usuários cadastrados no sistema.</p>
          <a href="/cadastro" className="btn-primary">
            <i className="fas fa-plus"></i> Cadastrar Primeiro Usuário
          </a>
        </div>
      ) : (
        <div className="usuarios-grid">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="usuario-info">
                <h3>{usuario.nome}</h3>
                <p><i className="fas fa-envelope"></i> {usuario.email}</p>
                <p><i className="fas fa-venus-mars"></i> {formatarSexo(usuario.sexo)}</p>
                <p><i className="fas fa-calendar"></i> {formatarData(usuario.dataNascimento)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lista-footer">
        <a href="/cadastro" className="btn-secondary">
          <i className="fas fa-plus"></i> Cadastrar Novo Usuário
        </a>
      </div>
    </div>
  );
};

export default ListaUsuarios;




