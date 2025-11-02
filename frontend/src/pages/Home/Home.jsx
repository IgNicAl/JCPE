import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/lib/api';
import './Home.css';

// Dados mockados para os widgets
const GAME_SCORES = [
  { team1: 'Sport', score1: 2, team2: 'Santa Cruz', score2: 1, status: 'Final' },
  { team1: 'Náutico', score1: 0, team2: 'América-PE', score2: 0, status: '1º Tempo' },
  { team1: 'Flamengo', score1: 3, team2: 'Palmeiras', score2: 1, status: 'Final' }
];
const WEATHER_FORECAST = {
  city: 'Recife',
  temperature: 28,
  description: 'Parcialmente nublado',
  humidity: 75,
  wind: '15 km/h'
};
const STOCK_MARKET = [
  { stock: 'PETR4', value: 32.45, variation: '+2.1%', color: 'green' },
  { stock: 'VALE3', value: 58.90, variation: '-1.3%', color: 'red' },
  { stock: 'ITUB4', value: 28.75, variation: '+0.8%', color: 'green' }
];

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
    title: 'Pernambuco investe em infraestrutura digital para empresas',
    summary: 'Governo anuncia R$ 100 milhões em investimentos para modernizar a infraestrutura tecnológica do estado.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    slug: 'infraestrutura-digital-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: 2,
    title: 'Recife sedia conferência internacional de tecnologia',
    summary: 'Evento reúne empreendedores e investidores de 50 países para discutir inovação e startups.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'conferencia-tech-recife',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: 3,
    title: 'Economia de Pernambuco cresce 3.2% no trimestre',
    summary: 'Indústria, comércio e serviços apresentam recuperação significativa conforme dados do IBGE.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    slug: 'economia-pe-crescimento',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: 4,
    title: 'Nova legislação ambiental entra em vigor em Pernambuco',
    summary: 'Lei visa proteger biomas locais e incentivar empresas a adotarem práticas sustentáveis.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    slug: 'legislacao-ambiental-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: 5,
    title: 'Turismo em Recife quebra recorde de visitantes',
    summary: 'Número de turistas internacionais chega a 1 milhão de pessoas em 2025.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    slug: 'turismo-recife-recorde',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: 6,
    title: 'Câmara aprova novo orçamento para educação em PE',
    summary: 'Investimento de R$ 2 bilhões reforça políticas de alfabetização e tecnologia nas escolas.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1427504494785-411a473e9f7f?w=600&h=400&fit=crop',
    slug: 'orcamento-educacao-pe',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

function Home() {
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
        const response = await newsService.getAll();
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
      <div className="home-container">
        <div className="home-loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="home-message error">
          <i className="fas fa-exclamation-circle" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Conteúdo principal com notícias por categoria */}
      <div className="home-content">
        {/* Coluna principal (notícias) */}
        <div className="main-column full-width">
          {/* Botões de ação para Admins e Jornalistas */}
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

          {loading && (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Carregando notícias...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
