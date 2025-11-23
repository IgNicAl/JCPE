import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/services/api';
import { News } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
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

type FilterType = 'all' | 'urgent' | 'high' | 'normal';

/**
 * @description Página para gerenciar notícias existentes. Permite visualizar uma lista,
 * navegar para a criação/edição e excluir notícias.
 */
const ManageNews: React.FC = () => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<FilterType>('all');
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
   * @description Abre o modal de confirmação para excluir uma notícia.
   * @param {string} id O ID da notícia a ser excluída.
   */
  const handleDeleteClick = (id: string): void => {
    setDeleteId(id);
  };

  /**
   * @description Executa a exclusão da notícia após confirmação.
   */
  const confirmDelete = async (): Promise<void> => {
    if (!deleteId) return;

    try {
      setDeletingId(deleteId);
      await newsService.delete(deleteId);
      await loadNews();
    } catch (err) {
      alert('Erro ao excluir notícia. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setDeletingId(null);
      setDeleteId(null);
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

  /**
   * @description Filtra e busca notícias baseado nos critérios selecionados.
   */
  const filteredNews = useMemo(() => {
    return news.filter((noticia) => {
      // Filtro de busca
      const matchesSearch = noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        noticia.summary.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de prioridade
      const matchesPriority = filterPriority === 'all' ||
        (filterPriority === 'urgent' && noticia.priority === PRIORITY_LEVEL.URGENT.value) ||
        (filterPriority === 'high' && noticia.priority === PRIORITY_LEVEL.HIGH.value) ||
        (filterPriority === 'normal' && noticia.priority === PRIORITY_LEVEL.NORMAL.value);

      return matchesSearch && matchesPriority;
    });
  }, [news, searchTerm, filterPriority]);

  /**
   * @description Calcula estatísticas das notícias.
   */
  const stats = useMemo(() => {
    return {
      total: news.length,
      urgent: news.filter(n => n.priority === PRIORITY_LEVEL.URGENT.value).length,
      high: news.filter(n => n.priority === PRIORITY_LEVEL.HIGH.value).length,
      normal: news.filter(n => n.priority === PRIORITY_LEVEL.NORMAL.value).length,
    };
  }, [news]);

  if (loading) {
    return (
      <div className="manage-news-container">
        <div className="loading-state">
          <div className="spinner-wrapper">
            <i className="fas fa-spinner fa-spin" />
          </div>
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
      {/* Header */}
      <div className="manage-news-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-newspaper" />
            <span>Gerenciar Notícias</span>
          </h1>
          <p className="subtitle">Gerencie todas as suas notícias publicadas</p>
        </div>
        <button type="button" onClick={() => navigate('/noticias/criar')} className="btn-create">
          <i className="fas fa-plus-circle" />
          Nova Notícia
        </button>
      </div>

      {news.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-inbox" />
          </div>
          <h2>Nenhuma notícia cadastrada</h2>
          <p>Comece criando sua primeira notícia para compartilhar com o mundo</p>
          <button type="button" onClick={() => navigate('/noticias/criar')} className="btn-create-first">
            <i className="fas fa-plus-circle" />
            Criar Primeira Notícia
          </button>
        </div>
      ) : (
        <>
          {/* Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-newspaper" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total de Notícias</span>
              </div>
            </div>
            <div className="stat-card urgent">
              <div className="stat-icon">
                <i className="fas fa-exclamation-circle" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.urgent}</span>
                <span className="stat-label">Urgentes</span>
              </div>
            </div>
            <div className="stat-card high">
              <div className="stat-icon">
                <i className="fas fa-flag" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.high}</span>
                <span className="stat-label">Alta Prioridade</span>
              </div>
            </div>
            <div className="stat-card normal">
              <div className="stat-icon">
                <i className="fas fa-check-circle" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.normal}</span>
                <span className="stat-label">Normais</span>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Buscar por título ou resumo..."
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
                className={filterPriority === 'all' ? 'active' : ''}
                onClick={() => setFilterPriority('all')}
              >
                <i className="fas fa-th" />
                Todas
              </button>
              <button
                type="button"
                className={filterPriority === 'urgent' ? 'active urgent' : 'urgent'}
                onClick={() => setFilterPriority('urgent')}
              >
                <i className="fas fa-exclamation-circle" />
                Urgente
              </button>
              <button
                type="button"
                className={filterPriority === 'high' ? 'active high' : 'high'}
                onClick={() => setFilterPriority('high')}
              >
                <i className="fas fa-flag" />
                Alta
              </button>
              <button
                type="button"
                className={filterPriority === 'normal' ? 'active normal' : 'normal'}
                onClick={() => setFilterPriority('normal')}
              >
                <i className="fas fa-check-circle" />
                Normal
              </button>
            </div>
          </div>

          {/* Lista de Notícias */}
          {filteredNews.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search" />
              <p>Nenhuma notícia encontrada com os filtros selecionados</p>
            </div>
          ) : (
            <div className="news-grid">
              {filteredNews.map((noticia) => {
                const priority = getPriorityLabel(noticia.priority);

                return (
                  <div
                    key={noticia.id}
                    className="news-card"
                    onClick={() => navigate(`/noticia/${noticia.slug || noticia.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {noticia.featuredImageUrl && (
                      <div className="news-image-wrapper">
                        <div className="news-image" style={{ backgroundImage: `url('${noticia.featuredImageUrl}')` }}>
                          <span className={`priority-badge ${priority.class}`}>
                            <i className="fas fa-flag" />
                            {priority.text}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="news-content">
                      <h2 className="news-title">{noticia.title}</h2>
                      <p className="news-summary">{noticia.summary}</p>
                      <div className="news-meta">
                        {!noticia.featuredImageUrl && (
                          <span className={`priority-tag ${priority.class}`}>
                            <i className="fas fa-flag" />
                            {priority.text}
                          </span>
                        )}
                        <span className="date">
                          <i className="far fa-calendar-alt" />
                          {new Date(noticia.publicationDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="news-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/noticias/editar/${noticia.id}`);
                        }}
                        className="btn-action edit"
                      >
                        <i className="fas fa-edit" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(noticia.id || '');
                        }}
                        className="btn-action delete"
                        disabled={deletingId === noticia.id}
                      >
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
        message="Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default ManageNews;

