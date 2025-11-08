import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/services/api';
import { News } from '@/types';
import './ManageNews.css';

interface NewsListItem extends News {
  summary: string;
  priority: number;
  featuredImageUrl?: string;
  publicationDate: string;
}

interface PriorityLevel {
  value: number;
  text: string;
  class: string;
}

const PRIORITY_LEVEL = {
  URGENT: { value: 3, text: 'Urgente', class: 'urgent' },
  HIGH: { value: 2, text: 'Alta', class: 'high' },
  NORMAL: { value: 1, text: 'Normal', class: 'normal' },
} as const;

/**
 * @description Página para gerenciar notícias existentes. Permite visualizar uma lista,
 * navegar para a criação/edição e excluir notícias.
 */
const ManageNews: React.FC = () => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * @description Carrega a lista de notícias da API.
   */
  const loadNews = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await newsService.getAllForManagement();
      setNews(response.data as NewsListItem[]);
    } catch (err) {
      setError('Erro ao carregar notícias. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  /**
   * @description Lida com a exclusão de uma notícia.
   * @param {string} id O ID da notícia a ser excluída.
   */
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Tem certeza que deseja excluir esta notícia?')) return;
    try {
      setDeletingId(id);
      await newsService.delete(id);
      await loadNews();
    } catch (err) {
      alert('Erro ao excluir notícia. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * @description Retorna o objeto de priority correspondente ao valor numérico.
   */
  const getPriorityLabel = (priorityValue: number): PriorityLevel => {
    if (priorityValue === PRIORITY_LEVEL.URGENT.value) return PRIORITY_LEVEL.URGENT;
    if (priorityValue === PRIORITY_LEVEL.HIGH.value) return PRIORITY_LEVEL.HIGH;
    return PRIORITY_LEVEL.NORMAL;
  };

  if (loading) {
    return (
      <div className="manage-news-container">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-news-container">
        <div className="error-state">
          <i className="fas fa-exclamation-circle" />
          <p>{error}</p>
          <button type="button" onClick={loadNews} className="retry-btn">
            <i className="fas fa-sync-alt" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-news-container">
      <div className="manage-news-header">
        <h1>
          <i className="fas fa-newspaper" /> Gerenciar Notícias
        </h1>
        <button type="button" onClick={() => navigate('/noticias/criar')} className="btn-create">
          <i className="fas fa-plus-circle" />
          Nova Notícia
        </button>
      </div>

      {news.length === 0 ? (
        <div className="no-news">
          <i className="fas fa-inbox" />
          <p>Nenhuma notícia cadastrada.</p>
          <button type="button" onClick={() => navigate('/noticias/criar')} className="btn-create-first">
            <i className="fas fa-plus-circle" />
            Criar Primeira Notícia
          </button>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((noticia) => {
            const priority = getPriorityLabel(noticia.priority);

            return (
              <div key={noticia.id} className="news-card">
                {noticia.featuredImageUrl && (
                  <div className="news-image" style={{ backgroundImage: `url(${noticia.featuredImageUrl})` }} />
                )}
                <div className="news-content">
                  <h2>{noticia.title}</h2>
                  <p className="news-summary">{noticia.summary}</p>
                  <div className="news-meta">
                    <span className={`priority ${priority.class}`}>
                      <i className="fas fa-flag" />
                      {priority.text}
                    </span>
                    <span className="date">
                      <i className="far fa-calendar-alt" />
                      {new Date(noticia.publicationDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="news-actions">
                    <button type="button" onClick={() => navigate(`/noticias/editar/${noticia.id}`)} className="edit-btn">
                      <i className="fas fa-edit" />
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(noticia.id || '')} className="delete-btn" disabled={deletingId === noticia.id}>
                      {deletingId === noticia.id ? (
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageNews;

