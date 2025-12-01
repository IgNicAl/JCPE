export interface TeamStanding {
  position: number;
  name: string;
  logo: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Match {
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  date: string;
  time: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  category: string;
}

export interface StandingsResponse {
  championship: string;
  teams: TeamStanding[];
}
