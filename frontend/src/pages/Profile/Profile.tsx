import React, { useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import './Profile.css';

// Tipo para publicação curtida (mock - substituir quando API estiver pronta)
type LikedPost = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  publicationDate: string;
};

// Dados mock - substituir com chamada à API
const mockLikedPosts: LikedPost[] = [
  {
    id: '1',
    title: 'Opening Day Of Boating Season, Seattle WA',
    summary: 'Of Course The Puget Sound Is Very Much Where There Is Water, There Are Boats. Today Is...',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    authorName: 'James',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    publicationDate: 'August 18, 2022',
  },
  {
    id: '2',
    title: 'How To Choose The Right Laptop For...',
    summary: 'Choosing The Right Laptop For Programming Can Be A Tough Process. It\'s Easy To Get Confused...',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    authorName: 'Louis Hoebregts',
    authorAvatar: 'https://i.pravatar.cc/150?img=33',
    publicationDate: 'May 25, 2022',
  },
  {
    id: '3',
    title: 'How We Built The First Real Self-Driving Car',
    summary: 'Electric Self-Driving Cars Will Save Millions Of Lives And Significantly Accelerate The World\'s...',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
    authorName: 'Mary',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    publicationDate: 'July 3, 2022',
  },
];

const mockSharedPosts: LikedPost[] = [];
const mockMyPosts: LikedPost[] = [];

// Número de posts por página
const POSTS_PER_PAGE = 12;

// Tipo de aba
type TabType = 'curtidas' | 'compartilhamentos' | 'publicacoes';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('curtidas');
  const [currentPage, setCurrentPage] = useState(1);

  // Determinar quais abas mostrar baseado no tipo de usuário
  const isJournalistOrAdmin = user?.userType === 'JOURNALIST' || user?.userType === 'ADMIN';

  // Obter posts da aba atual
  const getCurrentPosts = (): LikedPost[] => {
    switch (activeTab) {
      case 'curtidas':
        return mockLikedPosts;
      case 'compartilhamentos':
        return mockSharedPosts;
      case 'publicacoes':
        return mockMyPosts;
      default:
        return [];
    }
  };

  const currentPosts = getCurrentPosts();

  // Calcular posts da página atual
  const totalPages = Math.ceil(currentPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const displayPosts = currentPosts.slice(startIndex, endIndex);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mensagens de estado vazio
  const getEmptyMessage = (): string => {
    switch (activeTab) {
      case 'curtidas':
        return 'Você ainda não curtiu nenhuma publicação';
      case 'compartilhamentos':
        return 'Você ainda não compartilhou nenhuma publicação';
      case 'publicacoes':
        return 'Você ainda não criou nenhuma publicação';
      default:
        return '';
    }
  };

  return (
    <div className="profile-page">
      {/* Banner de Capa */}
      <div className="profile-banner">
        <div className="banner-gradient" />
      </div>

      {/* Header do Perfil */}
      <div className="profile-header-container">
        <div className="profile-header">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src={(user?.['avatar'] as string | undefined) || 'https://i.pravatar.cc/150?img=68'}
              alt={user?.name || 'User'}
              className="profile-avatar"
            />
          </div>

          {/* Nome e Navegação */}
          <div className="profile-info">
            <h1 className="profile-name">{user?.name || 'Usuário'}</h1>

            {/* Tabs de Navegação */}
            <nav className="profile-tabs">
              <button
                className={`profile-tab ${activeTab === 'curtidas' ? 'active' : ''}`}
                onClick={() => handleTabChange('curtidas')}
              >
                Curtidas
              </button>
              <button
                className={`profile-tab ${activeTab === 'compartilhamentos' ? 'active' : ''}`}
                onClick={() => handleTabChange('compartilhamentos')}
              >
                Compartilhamentos
              </button>
              {isJournalistOrAdmin && (
                <button
                  className={`profile-tab ${activeTab === 'publicacoes' ? 'active' : ''}`}
                  onClick={() => handleTabChange('publicacoes')}
                >
                  Publicações
                </button>
              )}
            </nav>
          </div>

          {/* Botão Edit Profile */}
          <button
            className="edit-profile-btn"
            onClick={() => window.location.href = '/perfil/editar'} // Using simple navigation for now, ideally use useNavigate hook if available or link
          >
            <i className="fas fa-user-edit" />
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Grid de Publicações */}
      <div className="profile-content">
        {displayPosts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox empty-state-icon" />
            <p className="empty-state-message">{getEmptyMessage()}</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {displayPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-image-wrapper">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="post-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-summary">{post.summary}</p>
                    <div className="post-footer">
                      <div className="post-author">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="author-avatar"
                          loading="lazy"
                        />
                        <div className="author-info">
                          <p className="author-name">{post.authorName}</p>
                          <p className="post-date">{post.publicationDate}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`bookmark-btn ${activeTab === 'curtidas' ? 'active' : ''}`}
                        aria-label="Remover dos salvos"
                      >
                        <i className={activeTab === 'curtidas' ? 'fas fa-bookmark' : 'far fa-bookmark'} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <i className="fas fa-chevron-left" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
