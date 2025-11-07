import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/services/api';
import './Empreendedorismo.css';

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
    title: 'Ecossistema de startups de Recife atrai investidores internacionais',
    summary: 'Capitalistas de risco estrangeiros apostam em inovações desenvolvidas no Polo Tecnológico de Recife.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'startups-recife-investimento',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: 2,
    title: 'Programa de microcrédito beneficia 5 mil empreendedores em PE',
    summary: 'Iniciativa governamental amplia acesso a capital para pequenos negócios no estado.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    slug: 'microCredito-pe',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: 3,
    title: 'Incubadora de empresas abre inscrições para novo programa',
    summary: 'Oportunidade para empreendedores apresentarem ideias inovadoras e receber mentoria.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'incubadora-programa',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: 4,
    title: 'Mulheres empreendedoras lideram crescimento econômico de Recife',
    summary: 'Dados mostram que empresárias geram mais de 40% dos novos empregos na região.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop',
    slug: 'mulheres-empreendedoras',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: 5,
    title: 'Reforma tributária favorece micro e pequenas empresas',
    summary: 'Governo implementa medidas para reduzir carga fiscal de pequenos negócios.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    slug: 'reforma-tributaria',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: 6,
    title: 'Universidade lança programa de empreendedorismo para estudantes',
    summary: 'Capacitação prática em gestão de negócios para formar nova geração de empresários.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'universidade-empreendedorismo',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

function Empreendedorismo() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();

  const featured = useMemo(() => news.find(n => n.isFeatured) || (news.length > 0 ? news[0] : null), [news]);
  const remaining = useMemo(() => news.filter(n => n.id !== featured?.id), [news, featured]);

  useEffect(() => {
    async function loadNews() {
    try {
    setLoading(true);
    setError('');
    const response = await newsService.getAll('empreendedorismo');
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

  if (loading) {
    return (
      <div className="empreendedorismo-container">
        <div className="empreendedorismo-loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="empreendedorismo-page">
      <div className="empreendedorismo-content">
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
                <div className="featured-news">
                  <div className="featured-image" style={{ backgroundImage: `url(${featured.featuredImageUrl})` }}>
                    <div className="featured-overlay"></div>
                    <div className="featured-content">
                      <div className="featured-badge">
                        <i className="fas fa-star"></i> DESTAQUE
                      </div>
                      <h2 className="featured-title">{featured.title}</h2>
                      <p className="featured-summary">{featured.summary}</p>
                      <div className="featured-meta">
                        <span className="featured-date">
                          <i className="far fa-calendar"></i>
                          {new Date(featured.publicationDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

export default Empreendedorismo;
