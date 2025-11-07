import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import NewsGrid from '@/components/organisms/NewsGrid';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import styles from './Home.module.css';

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
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading, error } = useNews({ autoFetch: true, initialData: MOCK_NEWS });

  return (
    <div className={styles.homePage}>
      <div className={styles.homeContent}>
        <div className={styles.mainColumn}>
          {/* Botões de ação para Admins e Jornalistas */}
          {user && (isAdmin() || isJournalist()) && (
            <div className={styles.actionButtonsSection}>
              {isJournalist() && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.CREATE_NEWS)}
                    className={styles.actionBtn}
                  >
                    <Icon name="fa-plus" /> Criar Notícia
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(ROUTES.MANAGE_NEWS)}
                    className={styles.actionBtn}
                  >
                    <Icon name="fa-edit" /> Gerenciar
                  </Button>
                </>
              )}
              {isAdmin() && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.MANAGE_USERS)}
                    className={styles.actionBtn}
                  >
                    <Icon name="fa-users" /> Usuários
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.ADMIN_REGISTER)}
                    className={styles.actionBtn}
                  >
                    <Icon name="fa-user-plus" /> Novo Admin
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.CREATE_NEWS)}
                    className={styles.actionBtn}
                  >
                    <Icon name="fa-plus" /> Criar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(ROUTES.MANAGE_NEWS)}
                    className={styles.actionBtn}
                  >
                    <Icon name="fa-cogs" /> Gerenciar
                  </Button>
                </>
              )}
            </div>
          )}

          <NewsGrid news={news} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default Home;
