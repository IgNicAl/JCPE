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
import './Recife.css';

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
    title: 'Recife avança em projetos de infraestrutura urbana',
    summary: 'Novos projetos de modernização são anunciados para a capital pernambucana com investimento de R$ 50 milhões.',
    category: 'recife',
    featuredImageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    slug: 'recife-infraestrutura',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Turismo em Recife cresce 25% em 2025',
    summary: 'Dados mostram aumento expressivo de visitantes na região, impulsionando economia local.',
    category: 'recife',
    featuredImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    slug: 'turismo-recife',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Políticas de sustentabilidade ganham força em PE',
    summary: 'Governo estadual implementa novo plano de preservação ambiental focado em energia renovável.',
    category: 'recife',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    slug: 'sustentabilidade-pe',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Startups de Recife recebem investimentos internacionais',
    summary: 'Empresas de tecnologia locais conquistam aportes de fundos de venture capital estrangeiros.',
    category: 'recife',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'startups-recife',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Eventos culturais animam o calendário de Recife',
    summary: 'Confira a programação de shows, festivais e apresentações para os próximos meses.',
    category: 'recife',
    featuredImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    slug: 'eventos-culturais',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '6',
    title: 'Dicas para aproveitar melhor Recife em 5 minutos',
    summary: 'Guia rápido com os principais pontos de interesse e restaurantes imprescindíveis na cidade.',
    category: 'recife',
    featuredImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop',
    slug: 'dicas-recife',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

const Recife: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading, error } = useNews({ autoFetch: true, page: 'recife', featuredPage: true, initialData: MOCK_NEWS });

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
    <div className="recife-page">
      <div className="recife-content">
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

export default Recife;

