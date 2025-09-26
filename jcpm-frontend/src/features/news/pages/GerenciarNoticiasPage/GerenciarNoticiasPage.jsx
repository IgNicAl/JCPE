import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticiaService } from '@/lib/api';
import './GerenciarNoticias.css';

const PRIORIDADE = {
  URGENTE: { value: 3, text: 'Urgente', class: 'urgente' },
  ALTA: { value: 2, text: 'Alta', class: 'alta' },
  NORMAL: { value: 1, text: 'Normal', class: 'normal' }
};

function GerenciarNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarNoticias();
  }, []);

  const carregarNoticias = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await noticiaService.getAllNoticias();
      setNoticias(response.data);
    } catch (error) {
      setError('Erro ao carregar notícias. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta notícia?')) return;
    try {
      setDeletingId(id);
      await noticiaService.deleteNoticia(id);
      await carregarNoticias();
    } catch (error) {
      alert('Erro ao excluir notícia. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getPrioridadeLabel = prioridade => {
    if (prioridade === PRIORIDADE.URGENTE.value) return PRIORIDADE.URGENTE;
    if (prioridade === PRIORIDADE.ALTA.value) return PRIORIDADE.ALTA;
    return PRIORIDADE.NORMAL;
  };

  if (loading) {
    return (
      <div className="gerenciar-noticias-container">
        <div className="gerenciar-noticias-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gerenciar-noticias-container">
        <div className="gerenciar-noticias-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={carregarNoticias} className="retry-btn">
            <i className="fas fa-sync-alt"></i>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gerenciar-noticias-container">
      <div className="gerenciar-noticias-header">
        <h1><i className="fas fa-newspaper"></i> Gerenciar Notícias</h1>
        <button
          onClick={() => navigate('/noticias/criar')}
          className="criar-noticia-btn"
        >
          <i className="fas fa-plus-circle"></i>
          Nova Notícia
        </button>
      </div>

      {noticias.length === 0 ? (
        <div className="sem-noticias">
          <i className="fas fa-inbox"></i>
          <p>Nenhuma notícia cadastrada.</p>
          <button
            onClick={() => navigate('/noticias/criar')}
            className="criar-primeira-btn"
          >
            <i className="fas fa-plus-circle"></i>
            Criar Primeira Notícia
          </button>
        </div>
      ) : (
        <div className="noticias-grid">
          {noticias.map(noticia => {
            const prioridade = getPrioridadeLabel(noticia.prioridade);

            return (
              <div key={noticia.id} className="noticia-card">
                {noticia.imagemUrl && (
                  <div
                    className="noticia-imagem"
                    style={{ backgroundImage: `url(${noticia.imagemUrl})` }}
                  />
                )}
                <div className="noticia-content">
                  <h2>{noticia.titulo}</h2>
                  <p className="noticia-resumo">{noticia.resumo}</p>
                  <div className="noticia-meta">
                    <span className={`prioridade ${prioridade.class}`}>
                      <i className="fas fa-flag"></i>
                      {prioridade.text}
                    </span>
                    <span className="data">
                      <i className="far fa-calendar-alt"></i>
                      {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="noticia-actions">
                    <button
                      onClick={() => navigate(`/noticias/editar/${noticia.id}`)}
                      className="edit-btn"
                    >
                      <i className="fas fa-edit"></i>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(noticia.id)}
                      className="delete-btn"
                      disabled={deletingId === noticia.id}
                    >
                      {deletingId === noticia.id ? (
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GerenciarNoticias;
