import React, { useMemo } from 'react';
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
  category?: string;
};

type SportsScoreboardProps = {
  standings: StandingRow[];
  highlight: MatchHighlight;
};

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const buildCalendar = (year: number, month: number, today: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let i = 0; i < firstDay; i += 1) {
    days.push({ date: null, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: day,
      isCurrentMonth: true,
      isToday: day === today,
    });
  }

  while (days.length % 7 !== 0) {
    days.push({ date: null, isCurrentMonth: false });
  }

  return days;
};

const SportsScoreboard: React.FC<SportsScoreboardProps> = ({
  standings,
  highlight,
}) => {
  const calendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthLabel = now.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    }).replace('.', '');

    return {
      monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
      weekDays: WEEK_DAYS,
      days: buildCalendar(year, month, today),
    };
  }, []);

  return (
    <section className="space-y-6">
      <HomeSectionTitle title="rodada esportiva" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendário Real */}
        <article className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-5 text-base font-semibold text-dark">{calendar.monthLabel}</div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {calendar.weekDays.map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-7 gap-1.5 text-center text-sm">
            {calendar.days.map((day, index) => (
              <div
                key={`${day.date}-${index}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full font-medium transition-all ${
                  day.isToday
                    ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200'
                    : day.isCurrentMonth
                    ? 'text-gray-800 hover:bg-gray-100'
                    : 'text-gray-300'
                }`}
              >
                {day.date}
              </div>
            ))}
          </div>
        </article>

        {/* Classificação */}
        <article className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-5 text-base font-semibold text-dark">Classificação</div>
          <div className="flex items-center border-b border-gray-200 pb-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <span className="w-7">#</span>
            <span className="flex-1 text-left">Clube</span>
            <span className="w-7 text-center">PJ</span>
            <span className="w-7 text-center">V</span>
            <span className="w-7 text-center">E</span>
            <span className="w-7 text-center">D</span>
            <span className="w-7 text-center">GM</span>
            <span className="w-7 text-center">GC</span>
            <span className="w-8 text-center">Pts</span>
          </div>
          <div className="mt-1 divide-y divide-gray-100">
            {standings.map((row, index) => (
              <div
                key={row.team}
                className="flex items-center py-2.5 text-sm text-dark transition-colors hover:bg-gray-50"
              >
                <span className="w-7 text-sm font-bold text-gray-600">{index + 1}</span>
                <div className="flex flex-1 items-center gap-2.5">
                  <img src={row.logo} alt={row.team} className="h-5 w-5 object-contain" />
                  <span className="truncate text-sm font-medium text-gray-800">{row.team}</span>
                </div>
                <span className="w-7 text-center text-xs text-gray-600">{row.stats.pj}</span>
                <span className="w-7 text-center text-xs text-gray-600">{row.stats.wins}</span>
                <span className="w-7 text-center text-xs text-gray-600">{row.stats.draws}</span>
                <span className="w-7 text-center text-xs text-gray-600">{row.stats.loses}</span>
                <span className="w-7 text-center text-xs text-gray-600">{row.stats.goalsFor}</span>
                <span className="w-7 text-center text-xs text-gray-600">{row.stats.goalsAgainst}</span>
                <span
                  className={`w-8 text-center text-sm font-bold ${
                    index === 0
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent'
                      : index < 3
                      ? 'text-pink-600'
                      : 'text-gray-800'
                  }`}
                >
                  {row.stats.points}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* Jogo */}
        <article className="rounded-2xl bg-gradient-to-br from-white to-pink-50/30 p-8 shadow-card">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Próximo Jogo</p>
            {highlight.category && (
              <span className="rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-pink-200">
                {highlight.category}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Confronto Visual */}
            <div className="flex items-center justify-between gap-6">
              {/* Time Casa */}
              <div className="flex flex-1 flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-20 blur-xl" />
                  <img
                    src={highlight.leftTeam.logo}
                    alt={highlight.leftTeam.name}
                    className="relative h-24 w-24 object-contain drop-shadow-2xl transition-transform hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{highlight.leftTeam.name}</p>
                  <span className="mt-1 inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                    Casa
                  </span>
                </div>
              </div>

              {/* VS Central */}
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-3 shadow-inner">
                  <p className="text-3xl font-black text-gray-800">VS</p>
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
              </div>

              {/* Time Visitante */}
              <div className="flex flex-1 flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 opacity-20 blur-xl" />
                  <img
                    src={highlight.rightTeam.logo}
                    alt={highlight.rightTeam.name}
                    className="relative h-24 w-24 object-contain drop-shadow-2xl transition-transform hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{highlight.rightTeam.name}</p>
                  <span className="mt-1 inline-block rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    Visitante
                  </span>
                </div>
              </div>
            </div>

            {/* Placar e Data */}
            <div className="rounded-xl border-2 border-pink-100 bg-white/50 p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-3xl font-black text-gray-800 shadow-md">
                    00
                  </span>
                  <span className="text-2xl font-bold text-pink-400">:</span>
                  <span className="flex h-14 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-3xl font-black text-gray-800 shadow-md">
                    00
                  </span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-600">{highlight.schedule}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export type { CalendarDay, StandingRow, MatchHighlight };
export default SportsScoreboard;
