import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/services/api';
import { NEWS_CATEGORIES } from '@/utils/constants';
import { MockNews, MOCK_NEWS } from '@/features/news/mocks/news';
import './Recife.css';

const Recife: React.FC = () => {
  const [news, setNews] = useState<MockNews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError('');
        const response = await newsService.getAll('recife');
        const receivedNews = Array.isArray(response?.data) ? (response.data as NewsItem[]) : [];
        receivedNews.sort((a, b) => (b.priority || 0) - (a.priority || 0) || new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        setNews(receivedNews.length > 0 ? receivedNews : MOCK_NEWS);
      } catch (err) {
        console.log('Usando dados de teste (backend indisponível)');
        setNews(MOCK_NEWS);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const featured = useMemo(() => news.find((n) => n.isFeatured) || (news.length > 0 ? news[0] : null), [news]);
  const remaining = useMemo(() => news.filter((n) => n.id !== featured?.id), [news, featured]);

  if (loading) {
    return (
      <div className="recife-container">
        <div className="recife-loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recife-page">
      <div className="recife-header">
        <h1>Recife em 5 Minutos</h1>
      </div>
      <div className="recife-content">
        <div className="main-column full-width">
          {user && (isAdmin() || isJournalist()) && (
            <div className="action-buttons-section">
              {isJournalist() && (
                <>
                  <button className="action-btn journalist-btn" onClick={() => navigate('/noticias/criar')}>
                    <i className="fas fa-plus"></i> Criar Notícia
                  </button>
                  <button className="action-btn journalist-btn" onClick={() => navigate('/noticias/gerenciar')}>
                    <i className="fas fa-edit"></i> Gerenciar
                  </button>
                </>
              )}
              {isAdmin() && (
                <>
                  <button className="action-btn admin-btn" onClick={() => navigate('/admin/usuarios')}>
                    <i className="fas fa-users"></i> Usuários
                  </button>
                  <button className="action-btn admin-btn" onClick={() => navigate('/cadastro-admin')}>
                    <i className="fas fa-user-plus"></i> Novo Admin
                  </button>
                  <button className="action-btn admin-btn" onClick={() => navigate('/noticias/criar')}>
                    <i className="fas fa-plus"></i> Criar
                  </button>
                  <button className="action-btn admin-btn" onClick={() => navigate('/noticias/gerenciar')}>
                    <i className="fas fa-cogs"></i> Gerenciar
                  </button>
                </>
              )}
            </div>
          )}

          {!loading && !error && news.length > 0 ? (
            <>
              {featured && (
                <Link to={`/noticia/${featured.slug}`} className="featured-link">
                  <div className="featured-news">
                    <div className="featured-image" style={{ backgroundImage: `url(${featured.featuredImageUrl})` }}></div>
                    <div className="featured-content">
                      <div className="featured-badge">
                        <i className="fas fa-star" /> DESTAQUE
                      </div>
                      <h2 className="featured-title">{featured.title}</h2>
                      <p className="featured-summary">{featured.summary}</p>
                      <div className="featured-meta">
                        <span>
                          <i className="far fa-calendar"></i> {new Date(featured.publicationDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {remaining.length > 0 ? (
                <div className="all-news-grid">
                  {remaining.map((n) => {
                    const category = NEWS_CATEGORIES.find((c) => c.id === (n.category || 'noticias')) || NEWS_CATEGORIES[0];
                    return (
                      <Link key={n.id} to={`/noticia/${n.slug}`} className="category-card">
                        <div className="card-image" style={{ backgroundImage: `url(${n.featuredImageUrl})` }}>
                          <span className="card-badge" style={{ backgroundColor: category.color }}>
                            {category.label}
                          </span>
                          <h3 className="card-title">{n.title}</h3>
                        </div>
                        <div className="card-content">
                          <p className="card-summary">{n.summary}</p>
                          <div className="card-footer">
                            <span className="card-date">
                              <i className="far fa-calendar"></i>
                              {new Date(n.publicationDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                !featured && (
                  <div className="no-news">
                    <p>Nenhuma notícia disponível</p>
                  </div>
                )
              )}
            </>
          ) : (
            <div className="no-news">
              <p>Nenhuma notícia disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recife;

