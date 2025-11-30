import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/atoms/Button';
import TagCarousel from '@/pages/Home/components/TagCarousel';
import HeroSlider from '@/components/organisms/HeroSlider';
import PostSection from '@/components/organisms/PostSection';
import { News } from '@/types';
import './Clima.css';

interface MockNews extends News {
  summary: string;
  slug: string;
  category: string;
  featuredImageUrl: string;
  publicationDate: string;
  priority: number;
}

const MOCK_NEWS: MockNews[] = [
  {
    id: '1',
    title: 'Previsão indica semana de bom tempo em Pernambuco',
    summary: 'Temperaturas estáveis e baixa possibilidade de chuvas marcam o clima nos próximos dias.',
    category: 'clima',
    featuredImageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop',
    slug: 'clima-pernambuco',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Mudanças climáticas afetam padrão de chuvas no Nordeste',
    summary: 'Especialistas alertam para alterações nos períodos tradicionais de precipitação.',
    category: 'clima',
    featuredImageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
    slug: 'clima-mudancas',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Umidade do ar em níveis críticos em Recife',
    summary: 'Meteorologia recomenda hidratação e cuidados com a saúde durante período crítico.',
    category: 'clima',
    featuredImageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?w=600&h=400&fit=crop',
    slug: 'umidade-recife',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Projeto de energia solar aproveita clima de Pernambuco',
    summary: 'Iniciativas de energia renovável crescem com investimentos em energia solar no estado.',
    category: 'clima',
    featuredImageUrl: 'https://images.unsplash.com/photo-1497440871519-89d128cb4d8d?w=600&h=400&fit=crop',
    slug: 'energia-solar-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Agropecuária adapta-se a novo padrão climático',
    summary: 'Produtores rurais buscam novas técnicas para lidar com variações de temperatura.',
    category: 'clima',
    featuredImageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    slug: 'agropecuaria-clima',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '6',
    title: 'Turismo de Recife se beneficia de clima tropical',
    summary: 'Destino atrai visitantes durante todo o ano graças às condições climáticas favoráveis.',
    category: 'clima',
    featuredImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    slug: 'turismo-clima',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

const Clima: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading, error } = useNews({ autoFetch: true, page: 'clima', featuredPage: true, initialData: MOCK_NEWS });

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
    <div className="clima-page">
      <div className="clima-content">
        {/* Tags Scroller */}
        <TagCarousel />

        {/* Hero Slider */}
        <div className="hero-section">
          <HeroSlider slides={heroSlides} className="hero-slider-main" />
        </div>

        {/* Seção de Posts Populares */}
        {popularNews.length > 0 && (
          <PostSection
            title="posts populares"
            news={popularNews as MockNews[]}
            showArrows={true}
            leftArrowDisabled={true}
            rightArrowDisabled={false}
          />
        )}

        {/* Seção de Novos Posts */}
        {newNews.length > 0 && (
          <PostSection
            title="novos posts"
            news={newNews as MockNews[]}
            showButton={true}
            buttonText="Ver todos"
            onButtonClick={() => navigate('/noticias')}
          />
        )}

        {/* Seção de Posts em Tendência */}
        {trendyNews.length > 0 && (
          <PostSection
            title="em alta"
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

export default Clima;
