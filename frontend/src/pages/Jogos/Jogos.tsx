import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/atoms/Button';
import TagScroller from '@/components/organisms/TagScroller';
import HeroSlider from '@/components/organisms/HeroSlider';
import PostSection from '@/components/organisms/PostSection';
import { News } from '@/types';
import { getMatches, getStandings, formatMatchDate, Match, Standing } from '@/services/sportsService';
import './Jogos.css';

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
    title: 'Sport vence clássico e assume liderança do Nordestão',
    summary: 'O Leão da Ilha derrotou o Santa Cruz por 2 a 1 no Arruda e assumiu a ponta da tabela.',
    category: 'jogos',
    featuredImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
    slug: 'sport-vence-classico',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Náutico contrata novo técnico para a temporada',
    summary: 'Timbu anuncia a contratação de treinador experiente para comandar o time em 2025.',
    category: 'jogos',
    featuredImageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
    slug: 'nautico-novo-tecnico',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Santa Cruz busca reforços para próxima temporada',
    summary: 'Tricolor do Arruda negocia com jogadores experientes para reforçar o elenco.',
    category: 'jogos',
    featuredImageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
    slug: 'santa-cruz-reforcos',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Campeonato Pernambucano 2025 tem data definida',
    summary: 'FPF divulga calendário completo da competição estadual que começa em janeiro.',
    category: 'jogos',
    featuredImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
    slug: 'campeonato-pernambucano-2025',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Retrô surpreende e vence fora de casa',
    summary: 'Fênix da Várzea conquista importante vitória na Série C do Brasileiro.',
    category: 'jogos',
    featuredImageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
    slug: 'retro-vence-fora',
    publicationDate: new Date().toISOString(),
    priority: 2
  }
];

const Jogos: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading } = useNews({ autoFetch: true, page: 'jogos', featuredPage: true, initialData: MOCK_NEWS });

  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loadingSports, setLoadingSports] = useState(true);

  useEffect(() => {
    loadSportsData();
  }, []);

  async function loadSportsData() {
    setLoadingSports(true);
    try {
      const [matchesData, standingsData] = await Promise.all([
        getMatches(),
        getStandings()
      ]);
      setMatches(matchesData);
      setStandings(standingsData);
    } catch (error) {
      console.error('Erro ao carregar dados esportivos:', error);
    } finally {
      setLoadingSports(false);
    }
  }

  return (
    <div className="jogos-page">
      <div className="jogos-content">
        <div className="jogos-tag-scroller">
          <TagScroller />
        </div>

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
              </>
            )}
          </div>
        )}

        <section className="hero-section">
          <HeroSlider 
            slides={news.slice(0, 5).map(item => ({
              id: item.id,
              title: item.title,
              summary: item.summary,
              imageUrl: item.featuredImageUrl,
              slug: item.slug
            }))} 
          />
        </section>

        {/* Seção de Esportes - Widgets lado a lado */}
        <section className="sports-widgets">
          {/* Widget de Placares */}
          <div className="widget scores-widget">
            <h2 className="widget-title">
              <i className="fas fa-futbol"></i> Placares
            </h2>
            {loadingSports ? (
              <div className="widget-loading">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <div className="scores-list">
                {matches.slice(0, 4).map(match => (
                  <div key={match.id} className={`score-item ${match.status}`}>
                    <div className="score-header">
                      <span className="score-league">{match.league}</span>
                      <span className={`score-status ${match.status}`}>
                        {match.status === 'live' && '🔴'}
                        {match.status === 'finished' && '✓'}
                        {match.status === 'scheduled' && '📅'}
                      </span>
                    </div>
                    <div className="score-match">
                      <div className="score-team">
                        <span className="team-name">{match.homeTeam}</span>
                        <span className="team-score">
                          {match.homeScore !== null ? match.homeScore : '-'}
                        </span>
                      </div>
                      <span className="score-vs">×</span>
                      <div className="score-team">
                        <span className="team-score">
                          {match.awayScore !== null ? match.awayScore : '-'}
                        </span>
                        <span className="team-name">{match.awayTeam}</span>
                      </div>
                    </div>
                    <div className="score-date">{formatMatchDate(match.date)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Widget de Classificação */}
          <div className="widget standings-widget">
            <h2 className="widget-title">
              <i className="fas fa-trophy"></i> Brasileirão Série A
            </h2>
            {loadingSports ? (
              <div className="widget-loading">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <>
                <div className="standings-compact">
                  <table className="standings-table-compact">
                    <thead>
                      <tr>
                        <th className="pos">#</th>
                        <th className="team">Time</th>
                        <th>P</th>
                        <th>J</th>
                        <th>SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.slice(0, 10).map(standing => (
                        <tr 
                          key={standing.position} 
                          className={getClassificationZone(standing.position)}
                        >
                          <td className="pos">{standing.position}</td>
                          <td className="team">{standing.team}</td>
                          <td className="points"><strong>{standing.points}</strong></td>
                          <td>{standing.played}</td>
                          <td className={standing.goalDifference > 0 ? 'positive' : standing.goalDifference < 0 ? 'negative' : ''}>
                            {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="standings-legend-compact">
                  <span className="legend-item">
                    <span className="legend-dot libertadores"></span> G6
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot sulamericana"></span> Sul
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot rebaixamento"></span> Z4
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        <PostSection 
          title="Notícias de Jogos"
          news={news}
        />
      </div>
    </div>
  );
};

// Helper para classificar zonas da tabela
function getClassificationZone(position: number): string {
  if (position <= 6) return 'zone-libertadores';
  if (position >= 7 && position <= 12) return 'zone-sulamericana';
  if (position >= 17) return 'zone-rebaixamento';
  return '';
}

export default Jogos;

