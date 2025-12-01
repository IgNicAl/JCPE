import { useState, useEffect } from 'react';
import { footballService } from '@/services/footballService';
import { TeamStanding, Match } from '@/types/football';

interface FootballData {
  standings: TeamStanding[];
  match: Match | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook customizado para buscar dados de futebol do Campeonato Pernambucano
 * @returns {FootballData} Classificação, jogo e estados de loading/error
 */
export const useFootballData = (): FootballData => {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar classificação e jogo em paralelo
        const [standingsResponse, matchData] = await Promise.all([
          footballService.getStandings(),
          footballService.getCurrentMatch().catch(() => null),
        ]);

        setStandings(standingsResponse?.teams || []);
        setMatch(matchData);
      } catch (err) {
        console.error('Erro ao buscar dados de futebol:', err);
        setError('Não foi possível carregar os dados do campeonato');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { standings, match, loading, error };
};
