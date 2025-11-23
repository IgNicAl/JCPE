import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsReviewService, categoryService } from '@/services/api';
import { News, Category } from '@/types';
import { formatDate } from '@/utils/formatters';
import './ReviewDashboard.css';

const ReviewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [activeTab, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'pending'
        ? await newsReviewService.getPendingReviews()
        : await newsReviewService.getReviewedNews();

      let filteredNews = response.data;

      // Filtrar por categoria se uma categoria específica foi selecionada
      if (selectedCategory !== 'all') {
        filteredNews = filteredNews.filter((news: News) =>
          news.category?.id === selectedCategory
        );
      }

      setNewsList(filteredNews);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (newsId: string) => {
    // Redirecionar para a página de revisão detalhada (a ser criada)
    // Por enquanto, vamos redirecionar para edição, mas idealmente seria uma tela específica
    navigate(`/admin/revisao/${newsId}`);
  };

  const handleManageCategories = () => {
    navigate('/admin/categorias');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING_REVIEW: 'Aguardando Revisão',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      PUBLISHED: 'Publicado',
      DRAFT: 'Rascunho'
    };
    return labels[status] || status;
  };

  return (
    <div className="review-dashboard-container">
      <div className="review-dashboard-header">
        <h1>
          <i className="fas fa-clipboard-check" />
          Painel de Revisão
        </h1>
        <button
          className="btn-manage-categories"
          onClick={handleManageCategories}
        >
          <i className="fas fa-folder-plus" /> Gerenciar Categorias
        </button>
      </div>

      <div className="review-filters">
        <div className="review-tabs">
          <button
            className={`review-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pendentes
          </button>
          <button
            className={`review-tab ${activeTab === 'reviewed' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviewed')}
          >
            Histórico
          </button>
        </div>

        <div className="category-filter">
          <label htmlFor="category-select">
            <i className="fas fa-filter" /> Filtrar por Categoria:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin" /> Carregando...
        </div>
      ) : newsList.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-check-circle" />
          <h3>Tudo limpo!</h3>
          <p>Não há notícias {activeTab === 'pending' ? 'pendentes de revisão' : 'no histórico'}.</p>
        </div>
      ) : (
        <div className="review-list">
          {newsList.map((news) => (
            <div key={news.id} className="review-card">
              <div className="review-card-content">
                <h3 className="review-card-title">{news.title}</h3>
                <div className="review-card-meta">
                  <span>
                    <i className="fas fa-user" />
                    {typeof news.author === 'object' ? news.author?.name : 'Autor desconhecido'}
                  </span>
                  <span>
                    <i className="fas fa-calendar" />
                    {formatDate(news.createdAt || '')}
                  </span>
                  {news.category && (
                    <span>
                      <i className="fas fa-folder" />
                      {news.category.name}
                    </span>
                  )}
                </div>

                {/* Exibir tags se existirem */}
                {news.tags && news.tags.length > 0 && (
                  <div className="review-card-tags">
                    {news.tags.map(tag => (
                      <span key={tag.id} className="review-tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <span className={`review-card-status status-${news.status?.toString().toLowerCase()}`}>
                  {getStatusLabel(news.status as string)}
                </span>
              </div>
              <div className="review-card-actions">
                <button
                  className="btn-review btn-primary"
                  onClick={() => handleReviewClick(news.id!)}
                >
                  <i className="fas fa-eye" />
                  {activeTab === 'pending' ? 'Revisar' : 'Ver Detalhes'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDashboard;
