import React from 'react';
import HomeSectionTitle from './HomeSectionTitle';

type CalendarDay = {
  date: number | null;
  isCurrentMonth: boolean;
  isToday?: boolean;
};

type StandingRow = {
  team: string;
  logo: string;
  stats: {
    pj: number;
    wins: number;
    draws: number;
    loses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
};

type MatchHighlight = {
  leftTeam: { name: string; logo: string };
  rightTeam: { name: string; logo: string };
  schedule: string;
};

type SportsScoreboardProps = {
  calendar: {
    monthLabel: string;
    days: CalendarDay[];
    weekDays: string[];
  };
  standings: StandingRow[];
  highlight: MatchHighlight;
};

const SportsScoreboard: React.FC<SportsScoreboardProps> = ({
  calendar,
  standings,
  highlight,
}) => (
  <section className="space-y-6">
    <HomeSectionTitle title="rodada esportiva" />
    <div className="grid gap-6 xl:grid-cols-3">
      <article className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 text-lg font-medium text-dark">{calendar.monthLabel}</div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-dark-50">
          {calendar.weekDays.map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2 text-center text-sm">
          {calendar.days.map((day, index) => (
            <div
              key={`${day.date}-${index}`}
              className={`flex h-10 items-center justify-center rounded-full ${
                day.isToday ? 'bg-primary text-white' : day.isCurrentMonth ? 'text-dark' : 'text-dark-50'
              }`}
            >
              {day.date}
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 text-lg font-medium text-dark">Times</div>
        <div className="flex items-center text-xs font-semibold text-dark-50">
          <span className="w-8">#</span>
          <span className="flex-1 text-left">Clube</span>
          <span className="w-8 text-center">PJ</span>
          <span className="w-8 text-center">V</span>
          <span className="w-8 text-center">E</span>
          <span className="w-8 text-center">D</span>
          <span className="w-8 text-center">GM</span>
          <span className="w-8 text-center">GC</span>
          <span className="w-8 text-center">Pts</span>
        </div>
        <div className="mt-3 space-y-3">
          {standings.map((row, index) => (
            <div
              key={row.team}
              className="flex items-center rounded-xl bg-gray/60 px-3 py-2 text-sm text-dark"
            >
              <span className="w-8 font-semibold">{index + 1}</span>
              <div className="flex flex-1 items-center gap-2">
                <img src={row.logo} alt={row.team} className="h-6 w-6 object-contain" />
                <span className="truncate font-medium">{row.team}</span>
              </div>
              <span className="w-8 text-center">{row.stats.pj}</span>
              <span className="w-8 text-center">{row.stats.wins}</span>
              <span className="w-8 text-center">{row.stats.draws}</span>
              <span className="w-8 text-center">{row.stats.loses}</span>
              <span className="w-8 text-center">{row.stats.goalsFor}</span>
              <span className="w-8 text-center">{row.stats.goalsAgainst}</span>
              <span className="w-8 text-center font-semibold text-primary">{row.stats.points}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl bg-white p-6 shadow-card">
        <p className="mb-1 text-sm text-dark-50">Rodada Final</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2">
            <img src={highlight.leftTeam.logo} alt={highlight.leftTeam.name} className="h-20" />
            <span className="rounded-full bg-primary-muted px-4 py-1 text-sm font-medium text-primary">
              {highlight.leftTeam.name}
            </span>
          </div>
          <div className="text-center">
            <p className="text-4xl font-semibold text-dark">VS</p>
            <p className="text-sm text-dark-75">{highlight.schedule}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-lg bg-primary-muted px-5 py-2 text-xl font-bold text-dark">00</span>
              <span className="text-base text-dark">:</span>
              <span className="rounded-lg bg-primary-muted px-5 py-2 text-xl font-bold text-dark">00</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={highlight.rightTeam.logo} alt={highlight.rightTeam.name} className="h-20" />
            <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
              {highlight.rightTeam.name}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
);

export type { CalendarDay, StandingRow, MatchHighlight };
export default SportsScoreboard;

