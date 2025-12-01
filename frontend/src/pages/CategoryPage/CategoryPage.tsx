import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { News } from '@/types';
import { MOCK_NEWS } from '@/features/news/mocks/news';
import Headlines from '@/pages/Home/components/Headlines';
import Highlights from '@/pages/Home/components/Highlights';
import NewPostsSection from '@/pages/Home/components/NewPostsSection';
import LatestVideosSection, { VideoPost } from '@/pages/Home/components/LatestVideosSection';
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
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
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

  // Transform news to include author info
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

  // Filter news by category/subcategory
  const filteredNews = newsWithAuthors.filter((item) => {
    if (!item.category) return false;

    if (subcategorySlug) {
      // Filter by subcategory
      return item.category.slug === subcategorySlug;
    } else {
      // Filter by category (including subcategories of this category)
      return item.category.slug === categorySlug ||
             item.category.parentCategory?.slug === categorySlug;
    }
  });

  // Filter by priority
  const urgentNews = filteredNews.filter(n => n.priority === 3);
  const highPriorityNews = filteredNews.filter(n => n.priority === 2);
  const normalNews = filteredNews.filter(n => n.priority === 1 || !n.priority);

  // Headlines: Urgent News (priority=3)
  const singleContentItems = urgentNews.slice(0, 2).map(news => ({
    id: news.id || '',
    title: news.title,
    summary: news.summary || '',
    imageUrl: getVideoThumbnail(news.featuredImageUrl),
    slug: news.slug || '',
  }));

  const sliderSlides = urgentNews.slice(2, 5).map(news => ({
    id: news.id || '',
    title: news.title,
    summary: news.summary || '',
    imageUrl: getVideoThumbnail(news.featuredImageUrl),
    slug: news.slug || '',
  }));

  // Helper: Get first day of current month
  const getCurrentMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  // Helper: Get first day of last month
  const getLastMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  };

  // Helper: Filter posts by period
  const filterPostsByPeriod = (newsList: typeof filteredNews, startDate: Date, endDate?: Date) => {
    return newsList.filter(item => {
      if (!item.publicationDate) return false;
      const pubDate = new Date(item.publicationDate);
      if (endDate) {
        return pubDate >= startDate && pubDate < endDate;
      }
      return pubDate >= startDate;
    });
  };

  // Filter posts by month
  const currentMonthStart = getCurrentMonthStart();
  const lastMonthStart = getLastMonthStart();
  const currentMonthNews = filterPostsByPeriod(filteredNews, currentMonthStart);
  const lastMonthNews = filterPostsByPeriod(filteredNews, lastMonthStart, currentMonthStart);

  // Trendy Posts (Em Alta): Top rated posts of the month
  let topRatedThisMonth = [...currentMonthNews]
    .filter(item => item.averageRating && item.averageRating > 0)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 4);

  // Fallback level 1: use last month if not enough data
  if (topRatedThisMonth.length < 4) {
    const topRatedLastMonth = [...lastMonthNews]
      .filter(item => item.averageRating && item.averageRating > 0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 4 - topRatedThisMonth.length);

    topRatedThisMonth = [...topRatedThisMonth, ...topRatedLastMonth];
  }

  // Fallback level 2: use high priority news if still not enough
  if (topRatedThisMonth.length < 4) {
    const fallbackPosts = highPriorityNews
      .filter(item => !topRatedThisMonth.find(p => p.id === item.id))
      .slice(0, 4 - topRatedThisMonth.length);

    topRatedThisMonth = [...topRatedThisMonth, ...fallbackPosts];
  }

  // Top Posts (Mais Lidos): Most viewed posts of the month
  let mostReadThisMonth = [...currentMonthNews]
    .filter(item => item.readCount && item.readCount > 0)
    .sort((a, b) => (b.readCount || 0) - (a.readCount || 0))
    .slice(0, 4);

  // Fallback level 1: use last month if not enough data
  if (mostReadThisMonth.length < 4) {
    const mostReadLastMonth = [...lastMonthNews]
      .filter(item => item.readCount && item.readCount > 0)
      .sort((a, b) => (b.readCount || 0) - (a.readCount || 0))
      .slice(0, 4 - mostReadThisMonth.length);

    mostReadThisMonth = [...mostReadThisMonth, ...mostReadLastMonth];
  }

  // Fallback level 2: use recent normal posts if still not enough
  if (mostReadThisMonth.length < 4) {
    const fallbackPosts = normalNews
      .filter(item => !mostReadThisMonth.find(p => p.id === item.id))
      .slice(0, 4 - mostReadThisMonth.length);

    mostReadThisMonth = [...mostReadThisMonth, ...fallbackPosts];
  }

  // Map to PostPreview
  const trendyPosts: PostPreview[] = topRatedThisMonth.map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  const topPosts: PostPreview[] = mostReadThisMonth.map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  // Highlights Posts: High Priority (priority=2)
  const highlightsPosts: PostPreview[] = highPriorityNews.slice(0, 4).map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  // New Posts: Normal Priority (priority=1)
  const newPosts: PostPreview[] = normalNews.slice(0, 6).map((item) => ({
    id: item.id || '',
    title: item.title,
    summary: item.summary || '',
    imageUrl: getVideoThumbnail(item.featuredImageUrl),
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    publicationDate: formatDate(item.publicationDate || new Date().toISOString()),
    slug: item.slug || '',
  }));

  // Filter video posts
  const videoNews = filteredNews.filter(n => n.mediaType === 'video');
  const videoPosts: VideoPost[] = videoNews.map(n => ({
    id: n.id || '',
    title: n.title,
    description: n.summary || '',
    imageUrl: getVideoThumbnail(n.featuredImageUrl),
    slug: n.slug || ''
  }));

  const videoHighlight = videoPosts.length > 0 ? videoPosts[0] : null;
  const latestVideos = videoPosts.length > 1 ? videoPosts.slice(1, 5) : [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-dark">
        Carregando notícias...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        Não foi possível carregar as notícias agora.
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)]">
      <div className="mx-auto flex max-w-[1512px] px-12 flex-col gap-12 py-10">
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
        {filteredNews.length === 0 ? (
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
          <>
            {/* Headlines - Priority 3 */}
            {(singleContentItems.length > 0 || sliderSlides.length > 0) && (
              <Headlines
                singleContentItems={singleContentItems}
                sliderSlides={sliderSlides}
              />
            )}

            {/* Highlights - Priority 2 */}
            {highlightsPosts.length > 0 && (
              <Highlights title="Destaques" posts={highlightsPosts} />
            )}

            {/* New Posts - Priority 1 */}
            {newPosts.length > 0 && (
              <NewPostsSection posts={newPosts} onShowAll={() => {}} />
            )}

            {/* Video Highlight */}
            {videoHighlight && (
              <LatestVideosSection highlight={videoHighlight} posts={latestVideos} />
            )}

            {/* Trendy Posts - Em Alta */}
            {trendyPosts.length > 0 && (
              <Highlights title="em alta" posts={trendyPosts} />
            )}

            {/* Top Posts - Mais Lidos */}
            {topPosts.length > 0 && (
              <Highlights title="Mais lidos" posts={topPosts} disableLeftArrow />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
