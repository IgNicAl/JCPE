import axios from 'axios';

// @ts-ignore
const API_KEY = import.meta.env?.VITE_FOOTBALL_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://v3.football.api-sports.io';

const footballApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

// Cache para economizar requisições (24 horas)
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private storage: Map<string, CacheItem<any>> = new Map();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 horas

  set<T>(key: string, data: T): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.TTL;
    if (isExpired) {
      this.storage.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.storage.clear();
  }
}

const cache = new Cache();

export interface Match {
  id: number;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeam: string;
  awayTeamLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  league: string;
  round: string;
}

export interface StandingTeam {
  rank: number;
  team: string;
  teamLogo: string;
  points: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
}

// IDs das ligas brasileiras
const LEAGUES = {
  BRASILEIRAO_A: 71, // Brasileirão Série A
  BRASILEIRAO_B: 72, // Brasileirão Série B
  COPA_DO_BRASIL: 73, // Copa do Brasil
  COPA_DO_NORDESTE: 141, // Copa do Nordeste
};

// IDs dos times de Pernambuco
const PERNAMBUCO_TEAMS = {
  SPORT: 124,
  NAUTICO: 138,
  SANTA_CRUZ: 7938,
};

/**
 * Buscar jogos recentes e ao vivo
 */
export async function getLiveAndRecentMatches(league: number = LEAGUES.BRASILEIRAO_A): Promise<Match[]> {
  const cacheKey = `matches_${league}_${new Date().toDateString()}`;
  const cached = cache.get<Match[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const response = await footballApi.get('/fixtures', {
      params: {
        league,
        season: new Date().getFullYear(),
        last: 10, // Últimos 10 jogos
      },
    });

    const matches: Match[] = response.data.response.map((fixture: any) => ({
      id: fixture.fixture.id,
      homeTeam: fixture.teams.home.name,
      homeTeamLogo: fixture.teams.home.logo,
      awayTeam: fixture.teams.away.name,
      awayTeamLogo: fixture.teams.away.logo,
      homeScore: fixture.goals.home,
      awayScore: fixture.goals.away,
      status: getStatusInPortuguese(fixture.fixture.status.short),
      date: fixture.fixture.date,
      league: fixture.league.name,
      round: fixture.league.round,
    }));

    cache.set(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return getMockMatches();
  }
}

/**
 * Buscar jogos de times de Pernambuco
 */
export async function getPernambucoTeamsMatches(): Promise<Match[]> {
  const cacheKey = `pernambuco_matches_${new Date().toDateString()}`;
  const cached = cache.get<Match[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const allMatches: Match[] = [];
    
    for (const teamId of Object.values(PERNAMBUCO_TEAMS)) {
      const response = await footballApi.get('/fixtures', {
        params: {
          team: teamId,
          season: new Date().getFullYear(),
          last: 5,
        },
      });

      const matches = response.data.response.map((fixture: any) => ({
        id: fixture.fixture.id,
        homeTeam: fixture.teams.home.name,
        homeTeamLogo: fixture.teams.home.logo,
        awayTeam: fixture.teams.away.name,
        awayTeamLogo: fixture.teams.away.logo,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away,
        status: getStatusInPortuguese(fixture.fixture.status.short),
        date: fixture.fixture.date,
        league: fixture.league.name,
        round: fixture.league.round,
      }));

      allMatches.push(...matches);
    }

    // Ordenar por data (mais recentes primeiro)
    allMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    cache.set(cacheKey, allMatches);
    return allMatches;
  } catch (error) {
    console.error('Erro ao buscar jogos de PE:', error);
    return getMockMatches();
  }
}

/**
 * Buscar tabela de classificação
 */
export async function getStandings(league: number = LEAGUES.BRASILEIRAO_A): Promise<StandingTeam[]> {
  const cacheKey = `standings_${league}`;
  const cached = cache.get<StandingTeam[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await footballApi.get('/standings', {
      params: {
        league,
        season: new Date().getFullYear(),
      },
    });

    const standings: StandingTeam[] = response.data.response[0].league.standings[0].map((team: any) => ({
      rank: team.rank,
      team: team.team.name,
      teamLogo: team.team.logo,
      points: team.points,
      played: team.all.played,
      won: team.all.win,
      draw: team.all.draw,
      lost: team.all.lose,
      goalsFor: team.all.goals.for,
      goalsAgainst: team.all.goals.against,
      goalsDiff: team.goalsDiff,
    }));

    cache.set(cacheKey, standings);
    return standings;
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return getMockStandings();
  }
}

/**
 * Traduzir status do jogo para português
 */
function getStatusInPortuguese(status: string): string {
  const statusMap: Record<string, string> = {
    'TBD': 'A definir',
    'NS': 'Não iniciado',
    '1H': '1º Tempo',
    'HT': 'Intervalo',
    '2H': '2º Tempo',
    'ET': 'Prorrogação',
    'P': 'Pênaltis',
    'FT': 'Encerrado',
    'AET': 'Encerrado (prorr.)',
    'PEN': 'Encerrado (pên.)',
    'PST': 'Adiado',
    'CANC': 'Cancelado',
    'ABD': 'Abandonado',
    'AWD': 'W.O.',
    'WO': 'W.O.',
    'LIVE': 'Ao Vivo',
  };

  return statusMap[status] || status;
}

/**
 * Dados mock para fallback
 */
function getMockMatches(): Match[] {
  return [
    {
      id: 1,
      homeTeam: 'Sport',
      homeTeamLogo: 'https://placehold.co/50x50?text=SPT',
      awayTeam: 'Santa Cruz',
      awayTeamLogo: 'https://placehold.co/50x50?text=STC',
      homeScore: 2,
      awayScore: 1,
      status: 'Encerrado',
      date: new Date().toISOString(),
      league: 'Campeonato Pernambucano',
      round: 'Rodada 10',
    },
    {
      id: 2,
      homeTeam: 'Náutico',
      homeTeamLogo: 'https://placehold.co/50x50?text=NAU',
      awayTeam: 'América-PE',
      awayTeamLogo: 'https://placehold.co/50x50?text=AME',
      homeScore: 0,
      awayScore: 0,
      status: 'Ao Vivo',
      date: new Date().toISOString(),
      league: 'Campeonato Pernambucano',
      round: 'Rodada 10',
    },
  ];
}

function getMockStandings(): StandingTeam[] {
  return [
    {
      rank: 1,
      team: 'Flamengo',
      teamLogo: 'https://placehold.co/50x50?text=FLA',
      points: 45,
      played: 20,
      won: 14,
      draw: 3,
      lost: 3,
      goalsFor: 38,
      goalsAgainst: 18,
      goalsDiff: 20,
    },
    {
      rank: 2,
      team: 'Palmeiras',
      teamLogo: 'https://placehold.co/50x50?text=PAL',
      points: 42,
      played: 20,
      won: 13,
      draw: 3,
      lost: 4,
      goalsFor: 35,
      goalsAgainst: 20,
      goalsDiff: 15,
    },
  ];
}

export { LEAGUES, PERNAMBUCO_TEAMS };
