import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { noticiaService } from '../services/api';
import './GerenciarNoticias.css';

const GerenciarNoticias = () => {
  const { user, isAdmin, isJornalista } = useAuth();
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Proteção de rota
  if (!user || (!isAdmin() && !isJornalista())) {
    navigate('/login');
    return null;
  }

  const carregarNoticias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await noticiaService.getAllNoticias();
      // Ordenar por data de publicação, mais recentes primeiro
      const sortedNoticias = response.data.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
      setNoticias(sortedNoticias);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar notícias.' });
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarNoticias();
  }, [carregarNoticias]);

  const handleEdit = (id) => {
    navigate(`/noticias/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.')) {
      try {
        await noticiaService.deleteNoticia(id);
        setMessage({ type: 'success', text: 'Notícia excluída com sucesso!' });
        // Recarrega a lista de notícias
        carregarNoticias();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao excluir a notícia.' });
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO).toLocaleString('pt-BR');
  };

  return (
    <div className="gerenciar-container">
      <div className="gerenciar-header">
        <h1><i className="fas fa-tasks"></i> Gerenciar Notícias</h1>
        <button onClick={() => navigate('/noticias/criar')} className="btn-criar">
          <i className="fas fa-plus"></i> Publicar Nova Notícia
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i> Carregando...
        </div>
      ) : (
        <div className="tabela-noticias-wrapper">
          <table className="tabela-noticias">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Data de Publicação</th>
                <th>Prioridade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {noticias.length > 0 ? (
                noticias.map((noticia) => (
                  <tr key={noticia.id}>
                    <td data-label="Título">{noticia.titulo}</td>
                    <td data-label="Autor">{noticia.autor?.nome || 'N/A'}</td>
                    <td data-label="Data">{formatarData(noticia.dataPublicacao)}</td>
                    <td data-label="Prioridade">
                      <span className={`prioridade-tag prioridade-${noticia.prioridade}`}>
                        {noticia.prioridade === 2 ? 'Principal' : noticia.prioridade === 1 ? 'Secundário' : 'Comum'}
                      </span>
                    </td>
                    <td data-label="Ações" className="coluna-acoes">
                      <button onClick={() => handleEdit(noticia.id)} className="btn-acao btn-editar">
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button onClick={() => handleDelete(noticia.id)} className="btn-acao btn-excluir">
                        <i className="fas fa-trash"></i> Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="nenhuma-noticia">Nenhuma notícia encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GerenciarNoticias;