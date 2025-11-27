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
import './Empreendedorismo.css';

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
    title: 'Ecossistema de startups de Recife atrai investidores internacionais',
    summary: 'Capitalistas de risco estrangeiros apostam em inovações desenvolvidas no Polo Tecnológico de Recife.',
    category: 'empreendedorismo',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'startups-recife-investimento',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Programa de microcrédito beneficia 5 mil empreendedores em PE',
    summary: 'Iniciativa governamental amplia acesso a capital para pequenos negócios no estado.',
    category: 'empreendedorismo',
    featuredImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    slug: 'microCredito-pe',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Incubadora de empresas abre inscrições para novo programa',
    summary: 'Oportunidade para empreendedores apresentarem ideias inovadoras e receber mentoria.',
    category: 'empreendedorismo',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'incubadora-programa',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Mulheres empreendedoras lideram crescimento econômico de Recife',
    summary: 'Dados mostram que empresárias geram mais de 40% dos novos empregos na região.',
    category: 'empreendedorismo',
    featuredImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop',
    slug: 'mulheres-empreendedoras',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Reforma tributária favorece micro e pequenas empresas',
    summary: 'Governo implementa medidas para reduzir carga fiscal de pequenos negócios.',
    category: 'empreendedorismo',
    featuredImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    slug: 'reforma-tributaria',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '6',
    title: 'Universidade lança programa de empreendedorismo para estudantes',
    summary: 'Capacitação prática em gestão de negócios para formar nova geração de empresários.',
    category: 'empreendedorismo',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'universidade-empreendedorismo',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
];

const Empreendedorismo: React.FC = () => {
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
        <TagCarousel />

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
