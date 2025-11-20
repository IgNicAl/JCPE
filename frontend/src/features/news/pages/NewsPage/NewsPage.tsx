import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { newsService } from '@/services/api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import Output from 'editorjs-react-renderer';
import { News, NewsStats, NewsComment } from '@/types';
import RatingStars from '@/components/molecules/RatingStars';
import './NewsPage.css';

interface NewsWithDetails extends News {
  contentJson?: string;
}

const NewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();

  const [news, setNews] = useState<NewsWithDetails | null>(null);
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [newComment, setNewComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadNewsData();
    }
  }, [slug]);

  const loadNewsData = async () => {
    if (!slug) return;
    try {
      setLoading(true);

      // First, get the news by slug
      const newsResponse = await newsService.getBySlug(slug);
      const newsData = newsResponse.data as NewsWithDetails;
      setNews(newsData);

      // Then, if we have newsId, load comments and stats
      if (newsData.id) {
        try {
          const commentsResponse = await newsService.getNewsComments(newsData.id);
          setComments(commentsResponse.data || []);
        } catch (err) {
          console.error('Erro ao carregar comentários:', err);
          setComments([]);
        }

        loadStats(newsData.id);
      }
    } catch (err) {
      setError('Notícia não encontrada.');
      console.error('Erro ao carregar notícia:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (newsId: string) => {
    try {
      const response = await newsService.getNewsStats(newsId);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleLike = async () => {
    if (!news?.id || !isAuthenticated()) return;
    try {
      if (stats?.userHasLiked) {
        await newsService.unlikeNews(news.id);
      } else {
        await newsService.likeNews(news.id);
      }
      loadStats(news.id);
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const handleShare = async (platform?: string) => {
    if (!news?.id) return;

    const url = window.location.href;
    const title = news.title;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copiado!');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    }

    // Register share
    try {
      await newsService.shareNews(news.id);
      loadStats(news.id);
    } catch (error) {
      console.error('Erro ao registrar compartilhamento:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!news?.id || !newComment.trim() || !isAuthenticated()) return;

    setSubmittingComment(true);
    try {
      const response = await newsService.addComment(news.id, newComment);
      setComments([response.data, ...comments]);
      setNewComment('');
      loadStats(news.id);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      alert('Erro ao adicionar comentário');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Deseja deletar este comentário?')) return;
    try {
      await newsService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      if (news?.id) {
        loadStats(news.id);
      }
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      alert('Erro ao deletar comentário');
    }
  };

  const handleRatingChange = () => {
    if (news?.id) {
      loadStats(news.id);
    }
  };

  // Mock data for sidebar (since we don't have endpoints for these yet)
  const tags = ['Montenegro', 'Visit Croatia', 'Luxury Travel', 'Travel Log', 'Paradise Island', 'Travel Info'];
  const topPosts = [
    { id: '1', title: 'How To Spend The Perfect Day On Croatia\'s Most Magical Island', image: '/placeholder-news-1.jpg', category: 'Travel' },
    { id: '2', title: 'Getting to Know the Local Culture', image: '/placeholder-news-2.jpg', category: 'Culture' },
    { id: '3', title: 'Best Places to Visit in Summer', image: '/placeholder-news-3.jpg', category: 'Travel' },
  ];

  if (loading) return <div className="news-page-loading">Carregando...</div>;
  if (error || !news) return <div className="news-page-error">{error || 'Notícia não encontrada'}</div>;

  return (
    <div className="news-page-wrapper">
      <div className="news-page-container">

        {/* Breadcrumbs */}
        <div className="news-breadcrumbs">
          <span>Home</span> &gt; <span>Featured</span> &gt; <span className="current">{news.title}</span>
        </div>

        <div className="news-grid-layout">

          {/* LEFT COLUMN: Main Content */}
          <div className="news-main-column">

            {/* Title */}
            <h1 className="news-title">{news.title}</h1>

            {/* Featured Image */}
            {news.featuredImageUrl && (
              <div className="news-featured-image-wrapper">
                <img
                  src={news.featuredImageUrl}
                  alt={news.title}
                  className="news-featured-image"
                />
              </div>
            )}

            {/* Meta Info Bar */}
            <div className="news-meta-bar">
              <div className="meta-item">
                <span className="icon">📅</span>
                <span>{news.publicationDate ? new Date(news.publicationDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
              </div>
              <div className="meta-item">
                <span className="icon">💬</span>
                <span>Comments: {stats?.commentsCount || 0}</span>
              </div>
              <div className="meta-item">
                <span className="icon">📂</span>
                <span>Category: News</span>
              </div>
            </div>

            {/* Content */}
            <div className="news-content">
              <h2 className="content-subtitle">Don't Wait. The Purpose Of Our Lives Is To Be Happy!</h2>
              {news.summary && <p className="news-summary">{news.summary}</p>}

              {news.contentJson ? (
                <Output data={JSON.parse(news.contentJson)} />
              ) : news.content ? (
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              ) : null}
            </div>

            {/* Share & Tags Bottom */}
            <div className="news-bottom-actions">
               <div className="news-tags-list">
                 {tags.slice(0, 3).map(tag => <span key={tag} className="tag-pill">#{tag}</span>)}
               </div>
               <div className="news-share-buttons">
                 <button onClick={() => handleShare('facebook')} className="share-icon fb">f</button>
                 <button onClick={() => handleShare('twitter')} className="share-icon tw">t</button>
                 <button onClick={() => handleShare('whatsapp')} className="share-icon wa">w</button>
               </div>
            </div>

            {/* Comments Section */}
            <div id="comments" className="comments-section">
              <h3 className="section-title">Comments ({stats?.commentsCount || 0})</h3>

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img
                      src={comment.user?.urlImagemPerfil || 'https://via.placeholder.com/40'}
                      alt={comment.user?.name}
                      className="comment-avatar"
                    />
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user?.name || 'Usuário'}</span>
                        <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
                        <div className="comment-actions">
                          <button className="reply-btn">Reply</button>
                          {user && (user.id === comment.user?.id || user.userType === 'ADMIN') && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteComment(comment.id)}
                              title="Deletar"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <div className="add-comment-section">
                <h3 className="section-title">Add A Comment</h3>
                {isAuthenticated() ? (
                  <form onSubmit={handleComment} className="comment-form-styled">
                    <div className="form-row">
                      <input type="text" placeholder="Name" value={user?.name || ''} disabled className="form-input" />
                      <input type="email" placeholder="Email" value={user?.email || ''} disabled className="form-input" />
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Your Comment"
                      className="form-textarea"
                      rows={5}
                    />
                    <div className="form-footer">
                      <div className="rating-input-wrapper">
                        <span>Rate This Article:</span>
                        <RatingStars
                          newsId={news.id}
                          initialRating={stats?.averageRating}
                          totalRatings={stats?.totalRatings}
                          onRate={handleRatingChange}
                          className="mini-rating"
                        />
                      </div>
                      <button type="submit" className="submit-btn" disabled={submittingComment}>
                        {submittingComment ? 'Sending...' : 'Send Comment'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="login-prompt">
                    Please <a href="/login">login</a> to leave a comment.
                  </div>
                )}
              </div>
            </div>

            {/* Related Posts */}
            <div className="related-posts-section">
              <h3 className="section-title">Related Posts</h3>
              <div className="related-posts-grid">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="related-post-card">
                    <div className="related-image-placeholder"></div>
                    <h4>Related News Title {i}</h4>
                    <span className="related-date">July 19, 2022</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <aside className="news-sidebar">

            {/* Top Actions */}
            <div className="sidebar-actions">
              <button className="action-btn share" onClick={() => handleShare('copy')}>
                <span className="icon">🔗</span> Share
              </button>
              <button
                className={`action-btn mark ${stats?.userHasLiked ? 'active' : ''}`}
                onClick={handleLike}
                title={stats?.userHasLiked ? 'Descurtir' : 'Curtir'}
              >
                <span className="icon">{stats?.userHasLiked ? '❤️' : '🔖'}</span>
                {stats?.userHasLiked ? 'Liked' : 'Marking'}
              </button>
              <button className="action-btn comment" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="icon">💬</span> Comment
              </button>
            </div>

            {/* Author Widget */}
            <div className="sidebar-widget author-widget">
              <div className="author-header">
                <img
                  src={typeof news.author === 'object' ? news.author.profileImageUrl : 'https://via.placeholder.com/50'}
                  alt="Author"
                  className="sidebar-author-avatar"
                />
                <div className="sidebar-author-info">
                  <span className="sidebar-author-name">{typeof news.author === 'object' ? news.author.name : 'Author Name'}</span>
                  <span className="sidebar-author-role">27 post</span>
                </div>
              </div>
              <button className="follow-btn">+ Follow</button>
            </div>

            {/* Tags Widget */}
            <div className="sidebar-widget tags-widget">
              <h4 className="widget-title">Tags</h4>
              <div className="tags-cloud">
                {tags.map(tag => (
                  <span key={tag} className="tag-item">{tag}</span>
                ))}
              </div>
            </div>

            {/* Top Post Widget */}
            <div className="sidebar-widget top-posts-widget">
              <h4 className="widget-title">Top Post</h4>
              <div className="top-posts-list">
                {topPosts.map(post => (
                  <div key={post.id} className="top-post-item">
                    <div className="top-post-image"></div>
                    <div className="top-post-info">
                      <span className="top-post-title">{post.title}</span>
                      <span className="top-post-read">read</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertising Widget */}
            <div className="sidebar-widget ad-widget">
              <div className="ad-placeholder">
                <span>Advertising</span>
                <small>350 px * 180 px</small>
              </div>
            </div>

            <div className="sidebar-widget ad-widget">
              <div className="ad-placeholder">
                <span>Advertising</span>
                <small>350 px * 180 px</small>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default NewsPage;
