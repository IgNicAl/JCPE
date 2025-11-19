import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/services/api';
import { NEWS_CATEGORIES } from '@/utils/constants';
import { MockNews, MOCK_NEWS } from '@/features/news/mocks/news';
import './Empreendedorismo.css';

const Empreendedorismo: React.FC = () => {
  const [news, setNews] = useState<MockNews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading, error } = useNews({ autoFetch: true, page: 'empreendedorismo', featuredPage: true, initialData: MOCK_NEWS });

  // Adicionar dados de autor mock para as notícias
  const newsWithAuthors = news.map((item, index) => ({
    ...item,
    authorName: ['James', 'Robert', 'Mary', 'Jon Kantner', 'Louis Hoebregts', 'Patricia'][index % 6] || 'Autor',
    authorAvatar: `https://placehold.co/44x44?text=${encodeURIComponent((['James', 'Robert', 'Mary', 'Jon Kantner', 'Louis Hoebregts', 'Patricia'][index % 6] || 'Autor')[0])}`,
  }));

  // Dividir notícias em seções conforme o design
  const popularNews = newsWithAuthors.slice(0, 4);
  const trendyNews = newsWithAuthors.slice(4, 8);
  const newNews = newsWithAuthors.slice(8, 12);

  // Dados para o HeroSlider
  const heroSlides = news.length > 0
    ? [
        {
          id: news[0].id,
          title: news[0].title,
          summary: (news[0] as MockNews).summary,
          imageUrl: (news[0] as MockNews).featuredImageUrl || 'https://placehold.co/744x452',
          slug: (news[0] as MockNews).slug,
        },
      ]
    : [];

  return (
    <div className="empreendedorismo-page">
      <div className="empreendedorismo-content">
        {/* Tags Scroller */}
        <TagScroller className="empreendedorismo-tag-scroller" />

        {/* Hero Slider */}
        <div className="hero-section">
          <HeroSlider slides={heroSlides} className="hero-slider-main" />
        </div>

        {/* Seção de Posts Populares */}
        {popularNews.length > 0 && (
          <PostSection
            title="popular posts"
            news={popularNews as MockNews[]}
            showArrows={true}
            leftArrowDisabled={true}
            rightArrowDisabled={false}
          />
        )}

        {/* Seção de Novos Posts */}
        {newNews.length > 0 && (
          <PostSection
            title="new posts"
            news={newNews as MockNews[]}
            showButton={true}
            buttonText="Show all"
            onButtonClick={() => navigate('/noticias')}
          />
        )}

        {/* Seção de Posts em Tendência */}
        {trendyNews.length > 0 && (
          <PostSection
            title="trendy posts"
            news={trendyNews as MockNews[]}
            showArrows={true}
            leftArrowDisabled={true}
            rightArrowDisabled={false}
          />
        )}

        {/* Botões de Ação para Admin/Journalist */}
        {user && (isAdmin() || isJournalist()) && (
          <div className="action-buttons-section">
            {isJournalist() && (
              <>
                <Button variant="primary" onClick={() => navigate(ROUTES.CREATE_NEWS)}>
                  <i className="fas fa-plus" /> Criar Notícia
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.MANAGE_NEWS)}>
                  <i className="fas fa-edit" /> Gerenciar
                </Button>
              </>
            )}
            {isAdmin() && (
              <>
                <Button variant="primary" onClick={() => navigate(ROUTES.MANAGE_USERS)}>
                  <i className="fas fa-users" /> Usuários
                </Button>
                <Button variant="primary" onClick={() => navigate(ROUTES.ADMIN_REGISTER)}>
                  <i className="fas fa-user-plus" /> Novo Admin
                </Button>
                <Button variant="primary" onClick={() => navigate(ROUTES.CREATE_NEWS)}>
                  <i className="fas fa-plus" /> Criar
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.MANAGE_NEWS)}>
                  <i className="fas fa-cogs" /> Gerenciar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Empreendedorismo;

