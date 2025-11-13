// Serviço para buscar dados de jogos e classificação
// Nota: Para produção, considere usar uma API oficial como API-Football

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'live' | 'finished' | 'scheduled';
  date: string;
  league: string;
}

export interface Standing {
  position: number;
  team: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

// Dados mock - Brasileirão Série A 2024
const MOCK_STANDINGS: Standing[] = [
  { position: 1, team: 'Botafogo', points: 68, played: 34, won: 20, drawn: 8, lost: 6, goalsFor: 55, goalsAgainst: 32, goalDifference: 23 },
  { position: 2, team: 'Palmeiras', points: 67, played: 34, won: 20, drawn: 7, lost: 7, goalsFor: 56, goalsAgainst: 28, goalDifference: 28 },
  { position: 3, team: 'Flamengo', points: 63, played: 34, won: 18, drawn: 9, lost: 7, goalsFor: 55, goalsAgainst: 38, goalDifference: 17 },
  { position: 4, team: 'Fortaleza', points: 63, played: 34, won: 18, drawn: 9, lost: 7, goalsFor: 48, goalsAgainst: 37, goalDifference: 11 },
  { position: 5, team: 'Internacional', points: 62, played: 34, won: 17, drawn: 11, lost: 6, goalsFor: 48, goalsAgainst: 32, goalDifference: 16 },
  { position: 6, team: 'São Paulo', points: 59, played: 34, won: 17, drawn: 8, lost: 9, goalsFor: 48, goalsAgainst: 35, goalDifference: 13 },
  { position: 7, team: 'Cruzeiro', points: 47, played: 34, won: 12, drawn: 11, lost: 11, goalsFor: 40, goalsAgainst: 38, goalDifference: 2 },
  { position: 8, team: 'Vasco', points: 46, played: 34, won: 12, drawn: 10, lost: 12, goalsFor: 38, goalsAgainst: 47, goalDifference: -9 },
  { position: 9, team: 'Bahia', points: 46, played: 34, won: 13, drawn: 7, lost: 14, goalsFor: 45, goalsAgainst: 44, goalDifference: 1 },
  { position: 10, team: 'Athletico-PR', points: 42, played: 34, won: 11, drawn: 9, lost: 14, goalsFor: 37, goalsAgainst: 41, goalDifference: -4 },
  { position: 11, team: 'Atlético-MG', points: 42, played: 34, won: 10, drawn: 12, lost: 12, goalsFor: 44, goalsAgainst: 50, goalDifference: -6 },
  { position: 12, team: 'Vitória', points: 41, played: 34, won: 11, drawn: 8, lost: 15, goalsFor: 41, goalsAgainst: 48, goalDifference: -7 },
  { position: 13, team: 'Grêmio', points: 39, played: 34, won: 11, drawn: 6, lost: 17, goalsFor: 38, goalsAgainst: 44, goalDifference: -6 },
  { position: 14, team: 'Juventude', points: 38, played: 34, won: 10, drawn: 8, lost: 16, goalsFor: 40, goalsAgainst: 52, goalDifference: -12 },
  { position: 15, team: 'Fluminense', points: 37, played: 34, won: 10, drawn: 7, lost: 17, goalsFor: 30, goalsAgainst: 37, goalDifference: -7 },
  { position: 16, team: 'Criciúma', points: 37, played: 34, won: 9, drawn: 10, lost: 15, goalsFor: 39, goalsAgainst: 49, goalDifference: -10 },
  { position: 17, team: 'Bragantino', points: 36, played: 34, won: 9, drawn: 9, lost: 16, goalsFor: 35, goalsAgainst: 44, goalDifference: -9 },
  { position: 18, team: 'Cuiabá', points: 29, played: 34, won: 6, drawn: 11, lost: 17, goalsFor: 26, goalsAgainst: 45, goalDifference: -19 },
  { position: 19, team: 'Atlético-GO', points: 25, played: 34, won: 6, drawn: 7, lost: 21, goalsFor: 28, goalsAgainst: 55, goalDifference: -27 },
  { position: 20, team: 'Corinthians', points: 30, played: 34, won: 7, drawn: 9, lost: 18, goalsFor: 31, goalsAgainst: 48, goalDifference: -17 },
];

const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    homeTeam: 'Sport',
    awayTeam: 'Náutico',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    league: 'Campeonato Pernambucano'
  },
  {
    id: '2',
    homeTeam: 'Santa Cruz',
    awayTeam: 'Retrô',
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    league: 'Campeonato Pernambucano'
  },
  {
    id: '3',
    homeTeam: 'Botafogo',
    awayTeam: 'Palmeiras',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    league: 'Brasileirão Série A'
  },
  {
    id: '4',
    homeTeam: 'Flamengo',
    awayTeam: 'São Paulo',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    league: 'Brasileirão Série A'
  },
  {
    id: '5',
    homeTeam: 'Internacional',
    awayTeam: 'Fortaleza',
    homeScore: 2,
    awayScore: 2,
    status: 'finished',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    league: 'Brasileirão Série A'
  },
  {
    id: '6',
    homeTeam: 'Cruzeiro',
    awayTeam: 'Atlético-MG',
    homeScore: 1,
    awayScore: 0,
    status: 'finished',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    league: 'Brasileirão Série A'
  }
];

// Função para buscar placares (usa dados mock por enquanto)
export async function getMatches(): Promise<Match[]> {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Implementar integração com API real
  // Por exemplo: Google Sports API, API-Football, etc.
  
  return MOCK_MATCHES;
}

// Função para buscar classificação (usa dados mock por enquanto)
export async function getStandings(): Promise<Standing[]> {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Implementar integração com API real
  
  return MOCK_STANDINGS;
}

// Helper para formatar data
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Amanhã às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === -1) {
    return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
