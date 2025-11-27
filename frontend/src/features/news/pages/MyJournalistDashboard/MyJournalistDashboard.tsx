import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { journalistStatsService, userService } from '@/services/api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MyJournalistDashboard.css';

interface TopNews {
  newsId: string;
  title: string;
  slug: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  averageRating: number;
}

interface JournalistStats {
  userId: string;
  journalistName: string;
  totalNews: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageRating: number;
  topNews: TopNews[];
  viewsByMonth: Record<string, number>;
}

interface User {
  id: string;
  name: string;
  userType: string;
}

const MyJournalistDashboard: React.FC = () => {
  const [stats, setStats] = useState<JournalistStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
    } else {
      loadStats();
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadStatsForUser(selectedUserId);
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers();
      // Filtrar apenas JOURNALIST e ADMIN
      const filteredUsers = response.data.filter(
        (user: User) => user.userType === 'JOURNALIST' || user.userType === 'ADMIN'
      );
      setUsers(filteredUsers);
      // Se houver usuários, selecionar o primeiro automaticamente
      if (filteredUsers.length > 0) {
        setSelectedUserId(filteredUsers[0].id);
      }
    } catch (err) {
      setError('Erro ao carregar usuários. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await journalistStatsService.getMyStats();
      setStats(response.data);
    } catch (err) {
      setError('Erro ao carregar estatísticas. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatsForUser = async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await journalistStatsService.getJournalistStats(userId);
      setStats(response.data);
    } catch (err) {
      setError('Erro ao carregar estatísticas. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(event.target.value);
  };

  if (loading) {
    return (
      <div className="my-dashboard-container">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="my-dashboard-container">
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

  // Preparar dados para gráfico de linha (views por mês)
  const viewsChartData = Object.entries(stats.viewsByMonth || {}).map(([month, count]) => ({
    month,
    publicações: count,
  }));

  // Preparar dados para gráfico de pizza (distribuição de engajamento)
  const engagementData = [
    { name: 'Likes', value: stats.totalLikes, color: '#ff6b6b' },
    { name: 'Comentários', value: stats.totalComments, color: '#4ecdc4' },
    { name: 'Compartilhamentos', value: stats.totalShares, color: '#45b7d1' },
  ];

  const totalEngagement = stats.totalLikes + stats.totalComments + stats.totalShares;

  return (
    <div className="my-dashboard-container">
      <div className="dashboard-header">
        <h1>
          <i className="fas fa-chart-line" />
          {isAdmin() ? 'Estatísticas de Usuário' : 'Minhas Estatísticas'}
        </h1>
        <p className="subtitle">
          {isAdmin()
            ? 'Visualize o desempenho de qualquer jornalista ou administrador'
            : `Olá, ${stats.journalistName}! Veja o desempenho das suas notícias`
          }
        </p>
      </div>

      {/* Seletor de Usuário (apenas para Admin) */}
      {isAdmin() && users.length > 0 && (
        <div className="user-selector-section">
          <label htmlFor="user-select">
            <i className="fas fa-user" />
            Selecionar Usuário:
          </label>
          <select
            id="user-select"
            value={selectedUserId}
            onChange={handleUserChange}
            className="user-select"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.userType === 'JOURNALIST' ? 'Jornalista' : 'Administrador'})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="stats-grid">
        <div className="stat-card total-news">
          <div className="stat-icon">
            <i className="fas fa-newspaper" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalNews}</span>
            <span className="stat-label">Notícias Publicadas</span>
          </div>
        </div>

        <div className="stat-card total-likes">
          <div className="stat-icon">
            <i className="fas fa-heart" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalLikes}</span>
            <span className="stat-label">Total de Likes</span>
          </div>
        </div>

        <div className="stat-card total-comments">
          <div className="stat-icon">
            <i className="fas fa-comments" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalComments}</span>
            <span className="stat-label">Total de Comentários</span>
          </div>
        </div>

        <div className="stat-card total-shares">
          <div className="stat-icon">
            <i className="fas fa-share-alt" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalShares}</span>
            <span className="stat-label">Total de Compartilhamentos</span>
          </div>
        </div>

        <div className="stat-card avg-rating">
          <div className="stat-icon">
            <i className="fas fa-star" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.averageRating.toFixed(1)}</span>
            <span className="stat-label">Avaliação Média</span>
          </div>
        </div>

        <div className="stat-card total-engagement">
          <div className="stat-icon">
            <i className="fas fa-fire" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalEngagement}</span>
            <span className="stat-label">Engajamento Total</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>
            <i className="fas fa-chart-area" />
            Publicações por Mês (Últimos 6 Meses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="publicações" stroke="#c41e3a" strokeWidth={3} dot={{ fill: '#c41e3a', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>
            <i className="fas fa-chart-pie" />
            Distribuição de Engajamento
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Notícias */}
      <div className="top-news-section">
        <h3>
          <i className="fas fa-trophy" />
          Top 5 Notícias Mais Populares
        </h3>
        {stats.topNews && stats.topNews.length > 0 ? (
          <div className="top-news-list">
            {stats.topNews.map((news, index) => (
              <div
                key={news.newsId}
                className="top-news-card"
                onClick={() => navigate(`/noticia/${news.slug}`)}
              >
                <div className="news-rank">#{index + 1}</div>
                <div className="news-info">
                  <h4>{news.title}</h4>
                  <div className="news-metrics">
                    <span className="metric">
                      <i className="fas fa-heart" />
                      {news.likes}
                    </span>
                    <span className="metric">
                      <i className="fas fa-comment" />
                      {news.comments}
                    </span>
                    <span className="metric">
                      <i className="fas fa-share-alt" />
                      {news.shares}
                    </span>
                    <span className="metric">
                      <i className="fas fa-star" />
                      {news.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="news-action">
                  <i className="fas fa-arrow-right" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-top-news">
            <i className="fas fa-inbox" />
            <p>Nenhuma notícia publicada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJournalistDashboard;
