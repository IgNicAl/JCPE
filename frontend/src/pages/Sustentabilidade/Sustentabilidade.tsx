import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/atoms/Button';
import TagScroller from '@/components/organisms/TagScroller';
import HeroSlider from '@/components/organisms/HeroSlider';
import PostSection from '@/components/organisms/PostSection';
import { News } from '@/types';
import './Sustentabilidade.css';

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
    title: 'Energia Renovável em Pernambuco cresce 40%',
    summary: 'Conheça os projetos de energia solar e eólica desenvolvidos no estado que impulsionam economia verde.',
    category: 'sustentabilidade',
    featuredImageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
    slug: 'energia-renovavel-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Preservação das Águas: Nova legislação em vigor',
    summary: 'Iniciativas para proteção dos recursos hídricos locais ganham força com novas regulamentações.',
    category: 'sustentabilidade',
    featuredImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    slug: 'preservacao-aguas',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Reflorestamento: 10 mil árvores plantadas em 2025',
    summary: 'Programas de plantio e restauração de áreas verdes transformam paisagem urbana de Recife.',
    category: 'sustentabilidade',
    featuredImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    slug: 'reflorestamento-recife',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Reciclagem: Recife alcança meta de redução de resíduos',
    summary: 'Projetos de gestão sustentável de resíduos sólidos mostram resultados positivos na cidade.',
    category: 'sustentabilidade',
    featuredImageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop',
    slug: 'reciclagem-recife',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Empresas locais adotam práticas sustentáveis',
    summary: 'Desenvolvimento sustentável: Empresas e comunidades comprometidas com práticas ecológicas.',
    category: 'sustentabilidade',
    featuredImageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop',
    slug: 'empresas-sustentaveis',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '6',
    title: 'Mobilidade Urbana Verde: Ciclovias expandidas',
    summary: 'Soluções de transporte sustentável transformam o deslocamento nas cidades de Pernambuco.',
    category: 'sustentabilidade',
    featuredImageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
    slug: 'mobilidade-verde',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

const Sustentabilidade: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading, error } = useNews({ autoFetch: true, page: 'sustentabilidade', featuredPage: true, initialData: MOCK_NEWS });

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
    <div className="sustentabilidade-page">
      <div className="sustentabilidade-content">
        {/* Tags Scroller */}
        <TagScroller className="sustentabilidade-tag-scroller" />

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

export default Sustentabilidade;

