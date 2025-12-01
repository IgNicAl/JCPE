import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { News } from '@/types';
import { MOCK_NEWS } from '@/features/news/mocks/news';
import Highlights from '@/pages/Home/components/Highlights';
import NewPostsSection from '@/pages/Home/components/NewPostsSection';
import { PostPreview } from '@/pages/Home/components/PostCardVertical';
import { getVideoThumbnail } from '@/utils/videoUtils';
import './CategoryPage.scss';

interface CategoryPageProps {
  categorySlug?: string;
  subcategorySlug?: string;
  categoryTitle?: string;
  subcategoryTitle?: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug: propCategorySlug,
  subcategorySlug: propSubcategorySlug,
  categoryTitle: propCategoryTitle,
  subcategoryTitle: propSubcategoryTitle,
}) => {
  const params = useParams<{ categorySlug?: string; subcategorySlug?: string }>();
  const { user } = useAuth();

  // Use props if provided, otherwise use URL params
  const categorySlug = propCategorySlug || params.categorySlug || '';
  const subcategorySlug = propSubcategorySlug || params.subcategorySlug;

  const [pageTitle, setPageTitle] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; path: string }[]>([]);

  // Fetch news with mock data as fallback
  const { news, loading, error } = useNews({ autoFetch: true, initialData: MOCK_NEWS as unknown as News[] });

  useEffect(() => {
    // Set page title and breadcrumbs based on slugs
    const categoryName = propCategoryTitle || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    const subcategoryName = propSubcategoryTitle || (subcategorySlug ? subcategorySlug.charAt(0).toUpperCase() + subcategorySlug.slice(1) : '');

    if (subcategorySlug) {
      setPageTitle(`${subcategoryName} - ${categoryName}`);
      setBreadcrumbs([
        { label: 'Início', path: '/' },
        { label: categoryName, path: `/categoria/${categorySlug}` },
        { label: subcategoryName, path: `/categoria/${categorySlug}/${subcategorySlug}` },
      ]);
    } else {
      setPageTitle(categoryName);
      setBreadcrumbs([
        { label: 'Início', path: '/' },
        { label: categoryName, path: `/categoria/${categorySlug}` },
      ]);
    }

    // Set document title for SEO
    document.title = `${pageTitle || categoryName} | JCPE`;
  }, [categorySlug, subcategorySlug, propCategoryTitle, propSubcategoryTitle, pageTitle]);

  // Transform news to PostPreview format
  const newsWithAuthors = news.map((item) => {
    const authorName = typeof item.author === 'string'
      ? item.author
      : item.author?.name || 'Autor';
    const authorInitial = authorName[0] || 'A';

    return {
      ...item,
      authorName,
      authorAvatar: `https://placehold.co/44x44?text=${encodeURIComponent(authorInitial)}`,
    };
  });

  const posts: PostPreview[] = newsWithAuthors.map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  // Filtrar notícias por prioridade
  // Priority 2 = Alta (Destaques na página de categoria)
  // Priority 1 = Normal (Posts recentes)
  const highPriorityNews = newsWithAuthors.filter(n => n.priority === 2);
  const normalNews = newsWithAuthors.filter(n => n.priority === 1 || !n.priority);

  // Destaques: Alta Prioridade (priority=2)
  const highPriorityPosts: PostPreview[] = highPriorityNews.map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  // Posts Normais: Prioridade Normal (priority=1)
  const normalPosts: PostPreview[] = normalNews.map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  // Split posts into sections based on priority
  const featuredPosts = highPriorityPosts.slice(0, 4);  // Destaques (priority=2)
  const recentPosts = normalPosts.slice(0, 6);  // Recentes (priority=1)
  const morePosts = highPriorityPosts.slice(4, 8);  // Mais destaques (priority=2)

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-page__container">
          <div className="category-page__loading">
            <i className="fas fa-spinner fa-spin" />
            <span>Carregando notícias...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="category-page__container">
          <div className="category-page__error">
            <i className="fas fa-exclamation-triangle" />
            <span>Erro ao carregar as notícias. Tente novamente mais tarde.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-page__container">
        {/* Breadcrumbs */}
        <nav className="category-page__breadcrumbs" aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span className="category-page__breadcrumb-separator">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="category-page__breadcrumb category-page__breadcrumb--active">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="category-page__breadcrumb">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title */}
        <h1 className="category-page__title">{pageTitle}</h1>

        {/* Content Sections */}
        {posts.length === 0 ? (
          <div className="category-page__empty">
            <i className="fas fa-newspaper" />
            <h2>Nenhuma notícia encontrada</h2>
            <p>Ainda não há notícias publicadas nesta categoria. Volte mais tarde!</p>
            <Link to="/" className="category-page__back-button">
              <i className="fas fa-arrow-left" />
              Voltar para a Home
            </Link>
          </div>
        ) : (
          <div className="category-page__content">
            {featuredPosts.length > 0 && (
              <div className="category-page__section">
                <Highlights title="Destaques" posts={featuredPosts} />
              </div>
            )}

            {recentPosts.length > 0 && (
              <div className="category-page__section">
                <NewPostsSection posts={recentPosts} onShowAll={() => {}} />
              </div>
            )}

            {morePosts.length > 0 && (
              <div className="category-page__section">
                <Highlights title="Mais Notícias" posts={morePosts} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
