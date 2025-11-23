import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { newsService } from '@/services/api';
import { News } from '@/types';
import './Profile.css';

// Tipo para publicação curtida
type LikedPost = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  publicationDate: string;
};

// Dados mock para compartilhamentos e publicações (ainda não implementados)
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
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar quais abas mostrar baseado no tipo de usuário
  const isJournalistOrAdmin = user?.userType === 'JOURNALIST' || user?.userType === 'ADMIN';

  // Buscar notícias curtidas ao carregar o componente
  useEffect(() => {
    if (activeTab === 'curtidas') {
      fetchLikedNews();
    }
  }, [activeTab, user]);

  const fetchLikedNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getLikedNews();
      const newsData = response.data as News[];

      // Converter para o formato LikedPost
      const converted = newsData.map((news) => ({
        id: news.id || '',
        title: news.title,
        summary: news.summary || '',
        imageUrl: news.featuredImageUrl || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
        authorName: typeof news.author === 'object' ? news.author.name : (news.author || 'Autor Desconhecido'),
        authorAvatar: typeof news.author === 'object' ? (news.author.profileImageUrl || 'https://i.pravatar.cc/150') : 'https://i.pravatar.cc/150',
        publicationDate: news.likedAt ? new Date(news.likedAt).toLocaleDateString('pt-BR') : '',
      }));

      setLikedPosts(converted);
    } catch (err) {
      console.error('Erro ao buscar notícias curtidas:', err);
      setError('Erro ao carregar notícias curtidas');
      setLikedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Obter posts da aba atual
  const getCurrentPosts = (): LikedPost[] => {
    switch (activeTab) {
      case 'curtidas':
        return likedPosts;
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

  // Função para curtir/descurtir notícia
  const handleToggleLike = async (newsId: string) => {
    try {
      // Verificar se já está curtida
      const isLiked = likedPosts.some(post => post.id === newsId);

      if (isLiked) {
        // Descurtir
        await newsService.unlikeNews(newsId);
        // Remover da lista
        setLikedPosts(prev => prev.filter(post => post.id !== newsId));
      } else {
        // Curtir
        await newsService.likeNews(newsId);
        // Recarregar a lista
        fetchLikedNews();
      }
    } catch (err) {
      console.error('Erro ao alternar like:', err);
      alert('Erro ao processar a ação. Tente novamente.');
    }
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
      <div
        className="profile-banner"
        style={{
          backgroundImage: user?.bannerUrl
            ? `url(${user.bannerUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!user?.bannerUrl && <div className="banner-gradient" />}
      </div>

      {/* Header do Perfil */}
      <div className="profile-header-container">
        <div className="profile-header">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src={user?.urlImagemPerfil || 'https://i.pravatar.cc/150?img=68'}
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
        {loading ? (
          <div className="empty-state">
            <i className="fas fa-spinner fa-spin empty-state-icon" />
            <p className="empty-state-message">Carregando...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <i className="fas fa-exclamation-triangle empty-state-icon" />
            <p className="empty-state-message">{error}</p>
          </div>
        ) : displayPosts.length === 0 ? (
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
                        onClick={() => handleToggleLike(post.id)}
                        aria-label={activeTab === 'curtidas' ? 'Descurtir notícia' : 'Curtir notícia'}
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
