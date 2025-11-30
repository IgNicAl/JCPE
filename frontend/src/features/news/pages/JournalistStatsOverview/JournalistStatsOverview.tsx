import { useState, useEffect } from 'react';
import { journalistStatsService } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './JournalistStatsOverview.css';

interface JournalistStats {
  userId: string;
  journalistName: string;
  totalNews: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageRating: number;
}

interface AllJournalistsStats {
  totalJournalists: number;
  totalNewsPublished: number;
  totalPlatformViews: number;
  journalists: JournalistStats[];
}

type SortField = 'journalistName' | 'totalNews' | 'totalLikes' | 'totalComments' | 'totalShares' | 'averageRating';
type SortOrder = 'asc' | 'desc';

const JournalistStatsOverview: React.FC = () => {
  const [stats, setStats] = useState<AllJournalistsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalLikes');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await journalistStatsService.getAllJournalistsStats();
      setStats(response.data);
    } catch (err) {
      setError('Erro ao carregar estatísticas. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortedJournalists = () => {
    if (!stats) return [];

    return [...stats.journalists].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  if (loading) {
    return (
      <div className="journalist-overview-container">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="journalist-overview-container">
        <div className="error-state">
          <i className="fas fa-exclamation-circle" />
          <p>{error || 'Erro ao carregar dados'}</p>
          <button type="button" onClick={loadStats} className="retry-btn">
            <i className="fas fa-sync-alt" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const sortedJournalists = getSortedJournalists();

  // Preparar dados para gráfico de barras (top 10 jornalistas por likes)
  const chartData = sortedJournalists.slice(0, 10).map(j => ({
    name: j.journalistName.split(' ')[0], // Apenas primeiro nome
    Likes: j.totalLikes,
    Comentários: j.totalComments,
    Compartilhamentos: j.totalShares,
  }));

  return (
    <div className="journalist-overview-container">
      <div className="overview-header">
        <h1>
          <i className="fas fa-users" />
          Estatísticas de Jornalistas
        </h1>
        <p className="subtitle">Visão geral do desempenho de todos os jornalistas</p>
      </div>

      {/* Cards de Métricas Gerais */}
      <div className="global-stats-grid">
        <div className="global-stat-card total-journalists">
          <div className="stat-icon">
            <i className="fas fa-users" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalJournalists}</span>
            <span className="stat-label">Total de Jornalistas</span>
          </div>
        </div>

        <div className="global-stat-card total-news">
          <div className="stat-icon">
            <i className="fas fa-newspaper" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalNewsPublished}</span>
            <span className="stat-label">Notícias Publicadas</span>
          </div>
        </div>

        <div className="global-stat-card avg-per-journalist">
          <div className="stat-icon">
            <i className="fas fa-chart-line" />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.totalJournalists > 0 ? (stats.totalNewsPublished / stats.totalJournalists).toFixed(1) : 0}
            </span>
            <span className="stat-label">Média por Jornalista</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Comparação */}
      <div className="chart-section">
        <h3>
          <i className="fas fa-chart-bar" />
          Top 10 Jornalistas por Engajamento
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Likes" fill="#ff6b6b" />
            <Bar dataKey="Comentários" fill="#4ecdc4" />
            <Bar dataKey="Compartilhamentos" fill="#45b7d1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de Ranking */}
      <div className="ranking-section">
        <h3>
          <i className="fas fa-list-ol" />
          Ranking de Jornalistas
        </h3>
        <div className="table-container">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => handleSort('journalistName')} className="sortable">
                  Jornalista
                  {sortField === 'journalistName' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
                <th onClick={() => handleSort('totalNews')} className="sortable">
                  Notícias
                  {sortField === 'totalNews' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
                <th onClick={() => handleSort('totalLikes')} className="sortable">
                  Likes
                  {sortField === 'totalLikes' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
                <th onClick={() => handleSort('totalComments')} className="sortable">
                  Comentários
                  {sortField === 'totalComments' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
                <th onClick={() => handleSort('totalShares')} className="sortable">
                  Compartilhamentos
                  {sortField === 'totalShares' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
                <th onClick={() => handleSort('averageRating')} className="sortable">
                  Avaliação Média
                  {sortField === 'averageRating' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedJournalists.map((journalist, index) => (
                <tr key={journalist.userId}>
                  <td className="rank-cell">
                    {index + 1}
                  </td>
                  <td className="name-cell">{journalist.journalistName}</td>
                  <td>{journalist.totalNews}</td>
                  <td className="likes-cell">{journalist.totalLikes}</td>
                  <td className="comments-cell">{journalist.totalComments}</td>
                  <td className="shares-cell">{journalist.totalShares}</td>
                  <td className="rating-cell">
                    <i className="fas fa-star" />
                    {journalist.averageRating.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JournalistStatsOverview;
