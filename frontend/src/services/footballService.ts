import api from './api';
import { StandingsResponse, Match } from '@/types/football';

export const footballService = {
  /**
   * Busca a classificação do Campeonato Pernambucano (Top 6)
   */
  getStandings: async (): Promise<StandingsResponse> => {
    const response = await api.get<StandingsResponse>('/football/standings');
    return response.data;
  },

  /**
   * Busca o próximo jogo agendado ou o último finalizado
   */
  getNextMatch: async (): Promise<Match> => {
    const response = await api.get<Match>('/football/next-match');
    return response.data;
  },

  /**
   * Busca o jogo ao vivo (se houver) ou o próximo jogo
   */
  getCurrentMatch: async (): Promise<Match> => {
    const response = await api.get<Match>('/football/current-match');
    return response.data;
  },
};
