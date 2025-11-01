import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/lib/api';
import './Recife.css';

const NEWS_CATEGORIES = [
  { id: 'noticias', label: 'Notícias', icon: 'fa-newspaper', color: '#c41e3a' },
  { id: 'esportes', label: 'Esportes', icon: 'fa-futbol', color: '#00aa44' },
  { id: 'politica', label: 'Política', icon: 'fa-landmark', color: '#003d82' },
  { id: 'economia', label: 'Economia', icon: 'fa-chart-line', color: '#ffc107' },
];

// Cards de teste para visualização
const MOCK_NEWS = [
  {
    id: 1,
    title: 'Recife avança em projetos de infraestrutura urbana',
    summary: 'Novos projetos de modernização são anunciados para a capital pernambucana com investimento de R$ 50 milhões.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    slug: 'recife-infraestrutura',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: 2,
    title: 'Turismo em Recife cresce 25% em 2025',
    summary: 'Dados mostram aumento expressivo de visitantes na região, impulsionando economia local.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    slug: 'turismo-recife',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: 3,
    title: 'Políticas de sustentabilidade ganham força em PE',
    summary: 'Governo estadual implementa novo plano de preservação ambiental focado em energia renovável.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    slug: 'sustentabilidade-pe',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: 4,
    title: 'Startups de Recife recebem investimentos internacionais',
    summary: 'Empresas de tecnologia locais conquistam aportes de fundos de venture capital estrangeiros.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'startups-recife',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: 5,
    title: 'Eventos culturais animam o calendário de Recife',
    summary: 'Confira a programação de shows, festivais e apresentações para os próximos meses.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    slug: 'eventos-culturais',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: 6,
    title: 'Dicas para aproveitar melhor Recife em 5 minutos',
    summary: 'Guia rápido com os principais pontos de interesse e restaurantes imprescindíveis na cidade.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop',
    slug: 'dicas-recife',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

function Recife() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();

  useEffect(() => {
    async function loadNews() {
    try {
    setLoading(true);
    setError('');
    const response = await newsService.getAll('recife');
    const receivedNews = Array.isArray(response?.data) ? response.data : [];
    receivedNews.sort((a, b) => b.priority - a.priority || new Date(b.publicationDate) - new Date(a.publicationDate));
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

  const featured = useMemo(() => news.find(n => n.isFeatured) || (news.length > 0 ? news[0] : null), [news]);
  const remaining = useMemo(() => news.filter(n => n.id !== featured?.id), [news, featured]);

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
              {/* Notícia Principal - Card Maior */}
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
                        <span><i className="far fa-calendar"></i> {new Date(featured.publicationDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid de cards normais */}
              {remaining.length > 0 ? (
                <div className="all-news-grid">
                  {remaining.map((n) => {
                    const category = NEWS_CATEGORIES.find(c => c.id === (n.category || 'noticias')) || NEWS_CATEGORIES[0];
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
}

export default Recife;
