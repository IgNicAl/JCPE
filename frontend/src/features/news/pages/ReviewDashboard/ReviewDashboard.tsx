import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsReviewService } from '@/services/api';
import { News } from '@/types';
import { formatDate } from '@/utils/formatters';
import './ReviewDashboard.css';

const ReviewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [activeTab]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'pending'
        ? await newsReviewService.getPendingReviews()
        : await newsReviewService.getReviewedNews();
      setNewsList(response.data);
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
      </div>

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
                      <i className="fas fa-tag" />
                      {news.category.name}
                    </span>
                  )}
                </div>
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
