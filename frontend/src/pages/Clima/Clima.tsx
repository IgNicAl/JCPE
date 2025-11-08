import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/services/api';
import { NEWS_CATEGORIES } from '@/utils/constants';
import { News } from '@/types';
import './Clima.css';

interface NewsItem extends News {
  summary: string;
  slug: string;
  category: string;
  featuredImageUrl: string;
  publicationDate: string;
  priority: number;
  isFeatured?: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Previsão indica semana de bom tempo em Pernambuco',
    summary: 'Temperaturas estáveis e baixa possibilidade de chuvas marcam o clima nos próximos dias.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop',
    slug: 'clima-pernambuco',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Mudanças climáticas afetam padrão de chuvas no Nordeste',
    summary: 'Especialistas alertam para alterações nos períodos tradicionais de precipitação.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
    slug: 'clima-mudancas',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Umidade do ar em níveis críticos em Recife',
    summary: 'Meteorologia recomenda hidratação e cuidados com a saúde durante período crítico.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?w=600&h=400&fit=crop',
    slug: 'umidade-recife',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Projeto de energia solar aproveita clima de Pernambuco',
    summary: 'Iniciativas de energia renovável crescem com investimentos em energia solar no estado.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1497440871519-89d128cb4d8d?w=600&h=400&fit=crop',
    slug: 'energia-solar-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Agropecuária adapta-se a novo padrão climático',
    summary: 'Produtores rurais buscam novas técnicas para lidar com variações de temperatura.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    slug: 'agropecuaria-clima',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '6',
    title: 'Turismo de Recife se beneficia de clima tropical',
    summary: 'Destino atrai visitantes durante todo o ano graças às condições climáticas favoráveis.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    slug: 'turismo-clima',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

const Clima: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();

  const featured = useMemo(() => news.find((n) => n.isFeatured) || (news.length > 0 ? news[0] : null), [news]);
  const remaining = useMemo(() => news.filter((n) => n.id !== featured?.id), [news, featured]);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError('');
        const response = await newsService.getAll('clima');
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

  if (loading) {
    return (
      <div className="clima-container">
        <div className="clima-loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clima-page">
      <div className="clima-content">
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

export default Clima;

