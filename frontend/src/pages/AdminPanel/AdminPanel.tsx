import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import './AdminPanel.css';

/**
 * Painel Administrativo - Centraliza todas as funcionalidades de gerenciamento
 */
const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isJournalist, isReviewer } = useAuth();

  const canManageNews = isAdmin() || isJournalist();
  const canReview = isAdmin() || isReviewer();
  const canManageUsers = isAdmin();
  const canManageCategories = isAdmin() || isReviewer();

  interface PanelCard {
    title: string;
    description: string;
    icon: string;
    color: string;
    route: string;
    permission: boolean;
  }

  const cards: PanelCard[] = [
    {
      title: 'Gerenciar Notícias',
      description: 'Crie, edite e gerencie todas as notícias do portal',
      icon: 'fa-newspaper',
      color: '#c41e3a',
      route: '/noticias/gerenciar',
      permission: canManageNews,
    },
    {
      title: 'Painel de Revisão',
      description: 'Revise e aprove notícias pendentes de publicação',
      icon: 'fa-clipboard-check',
      color: '#00aa44',
      route: '/painel/revisao',
      permission: canReview,
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Administre usuários, permissões e cadastros',
      icon: 'fa-users-cog',
      color: '#003d82',
      route: '/painel/usuarios',
      permission: canManageUsers,
    },
    {
      title: 'Gerenciar Categorias',
      description: 'Organize categorias e subcategorias de notícias',
      icon: 'fa-tags',
      color: '#ffc107',
      route: '/painel/categorias',
      permission: canManageCategories,
    },
    {
      title: 'Estatísticas de Jornalistas',
      description: 'Visão geral do desempenho de todos os jornalistas',
      icon: 'fa-chart-bar',
      color: '#00bcd4',
      route: '/painel/estatisticas/jornalistas',
      permission: canManageUsers,
    },
    {
      title: 'Minhas Estatísticas',
      description: 'Acompanhe o desempenho das suas notícias',
      icon: 'fa-chart-line',
      color: '#4caf50',
      route: '/painel/minhas-estatisticas',
      permission: canManageNews,
    },
    {
      title: 'Cadastrar Usuário',
      description: 'Registre novos jornalistas, revisores ou administradores',
      icon: 'fa-user-plus',
      color: '#9c27b0',
      route: '/cadastro-interno',
      permission: canManageUsers,
    },
  ];

  const availableCards = cards.filter(card => card.permission);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleKeyDown = (e: React.KeyboardEvent, route: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(route);
    }
  };

  // Definir título e subtítulo baseado no tipo de usuário
  const getPanelTitle = () => {
    if (isAdmin()) {
      return {
        title: 'Painel Administrativo',
        subtitle: 'Gerencie todas as funcionalidades do portal JCPE',
        icon: 'fa-tachometer-alt'
      };
    } else if (isJournalist()) {
      return {
        title: 'Painel do Jornalista',
        subtitle: 'Crie e gerencie suas notícias',
        icon: 'fa-newspaper'
      };
    } else if (isReviewer()) {
      return {
        title: 'Painel do Revisor',
        subtitle: 'Revise e aprove notícias pendentes',
        icon: 'fa-clipboard-check'
      };
    }
    return {
      title: 'Área do Usuário',
      subtitle: 'Suas funcionalidades',
      icon: 'fa-user'
    };
  };

  const panelInfo = getPanelTitle();

  if (availableCards.length === 0) {
    return (
      <div className="admin-panel">
        <div className="admin-panel-container">
          <div className="admin-panel-header">
            <h1>
              <i className={`fas ${panelInfo.icon}`}></i>
              {panelInfo.title}
            </h1>
            <p>Você não tem permissões de gerenciamento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-container">
        <div className="admin-panel-header">
          <h1>
            <i className={`fas ${panelInfo.icon}`}></i>
            {panelInfo.title}
          </h1>
          <p>{panelInfo.subtitle}</p>
        </div>

        <div className="admin-panel-grid">
          {availableCards.map((card, index) => (
            <div
              key={index}
              className="admin-panel-card"
              onClick={() => handleCardClick(card.route)}
              onKeyDown={(e) => handleKeyDown(e, card.route)}
              tabIndex={0}
              role="button"
              aria-label={`Acessar ${card.title}`}
            >
              <div className="card-icon-border" style={{ borderTopColor: card.color }}>
                <div className="card-icon" style={{ color: card.color }}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
              </div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="card-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panel-stats">
          <div className="stat-card">
            <i className="fas fa-shield-alt"></i>
            <div className="stat-info">
              <span className="stat-label">Status</span>
              <span className="stat-value">Ativo</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-lock"></i>
            <div className="stat-info">
              <span className="stat-label">Permissões</span>
              <span className="stat-value">{availableCards.length} módulo{availableCards.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
