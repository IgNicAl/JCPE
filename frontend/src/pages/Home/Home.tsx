import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/atoms/Button';
import TagScroller from '@/components/organisms/TagScroller';
import Highlights from '@/components/organisms/Highlights'; // O componente principal de destaques
import PostSection from '@/components/organisms/PostSection';
import { MockNews, MOCK_NEWS } from '@/features/news/mocks/news';
import './Home.css';

/**
 * Componente Home (Página Principal)
 * * Responsável por orquestrar a exibição dos principais componentes da página inicial,
 * buscar dados de notícias e controlar o acesso a funcionalidades administrativas.
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  // Hooks de contexto e navegação
  const { user, isAdmin, isJournalist } = useAuth();
  // Hook de dados: 'useNews' é inicializado com MOCK_NEWS para dev.
  // A flag 'autoFetch' garante que ele tentará buscar dados reais se configurado.
  const { news, loading, error } = useNews({ autoFetch: true, initialData: MOCK_NEWS });

  // Transformação de dados: Enriquecendo os dados da API (ou mock) com dados de UI
  // (ex: autor mock). Isso mantém o componente de UI (PostSection) mais limpo.
  const newsWithAuthors = news.map((item, index) => ({
    ...item,
    authorName: ['James', 'Robert', 'Mary', 'Jon Kantner', 'Louis Hoebregts', 'Patricia'][index % 6] || 'Autor',
    authorAvatar: `https://placehold.co/44x44?text=${encodeURIComponent((['James', 'Robert', 'Mary', 'Jon Kantner', 'Louis Hoebregts', 'Patricia'][index % 6] || 'Autor')[0])}`,
  }));

  // Preparação de dados para componentes filhos.
  // A lógica de fatiamento (slicing) deve, idealmente, vir da API (ex: /popular, /trendy)
  // mas está sendo tratada no frontend por enquanto.
  const popularNews = newsWithAuthors.slice(0, 4);
  const trendyNews = newsWithAuthors.slice(4, 8);
  const newNews = newsWithAuthors.slice(8, 12);

  // Mapeamento de dados específico para o componente Highlights.
  // Este componente espera dois tipos de props:
  // 1. singleContentItems: Os dois primeiros itens para os cards estáticos.
  // 2. sliderSlides: Os próximos 3 itens para o carrossel.
  const singleContentItems = newsWithAuthors.slice(0, 2).map(news => ({
    id: news.id,
    title: news.title,
    summary: news.summary,
    imageUrl: news.featuredImageUrl,
    slug: news.slug,
  }));

  const sliderSlides = newsWithAuthors.slice(2, 5).map(news => ({
    id: news.id,
    title: news.title,
    summary: news.summary,
    imageUrl: news.featuredImageUrl,
    slug: news.slug,
  }));

  // TODO: Adicionar tratamento de 'loading' e 'error'
  // if (loading) return <LoadingSpinner />;
  // if (error) return <ErrorDisplay message={error.message} />;

  return (
    <div className="home-page">
      <div className="home-content">
        {/* Componente de navegação por tags */}
        <TagScroller className="home-tag-scroller" />

        {/* Seção principal de destaques.
          Recebe os dados já formatados, mantendo o Highlights como um componente "burro"
          que apenas renderiza o que recebe via props.
        */}
        <Highlights
          singleContentItems={singleContentItems}
          sliderSlides={sliderSlides}
          className="hero-section" // 'hero-section' do Home.css aplica margens corretas
        />

        {/* Seções de Posts (Popular, Novo, Tendência) */}
        {/* A renderização é condicional para evitar que a seção apareça se não houver dados. */}
        {popularNews.length > 0 && (
          <PostSection
            title="popular posts"
            news={popularNews as MockNews[]}
            showArrows={true}
            leftArrowDisabled={true}
            rightArrowDisabled={false}
          />
        )}

        {newNews.length > 0 && (
          <PostSection
            title="new posts"
            news={newNews as MockNews[]}
            showButton={true}
            buttonText="Show all"
            onButtonClick={() => navigate('/noticias')}
          />
        )}

        {trendyNews.length > 0 && (
          <PostSection
            title="trendy posts"
            news={trendyNews as MockNews[]}
            showArrows={true}
            leftArrowDisabled={true}
            rightArrowDisabled={false}
          />
        )}

        {/* Renderização condicional de Ações Administrativas.
          Verifica se o usuário existe e se possui a role de Admin ou Jornalista.
        */}
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
            {/* Admin também vê as ações de Jornalista (assumindo sobreposição de regras) */}
            {/* Se as regras não se sobrepõem, o 'if' do jornalista deve ser 'isJournalist() && !isAdmin()' */}
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

export default Home;
