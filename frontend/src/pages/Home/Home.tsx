import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/atoms/Button';
import Headlines from './components/Headlines';
import { MOCK_NEWS } from '@/features/news/mocks/news';
import { News } from '@/types';
import TagCarousel from './components/TagCarousel';
import Highlights from './components/Highlights';
import NewPostsSection from './components/NewPostsSection';
import LatestVideosSection, { VideoPost } from './components/LatestVideosSection';
import { getVideoThumbnail } from '@/utils/videoUtils';
import WeatherSection, {
  HourPoint,
  ForecastDay,
  CityWeather,
} from './components/WeatherSection';
import SportsScoreboard, {
  StandingRow,
  MatchHighlight,
} from './components/SportsScoreboard';
import { PostPreview } from './components/PostCardVertical';
import { WEATHER_ICONS } from '@/utils/weatherIcons';
import petrolinaImg from '@/assets/weather-cities/petrolina.png';
import garanhunImg from '@/assets/weather-cities/garanhuns.png';
import caruaruImg from '@/assets/weather-cities/caruaru.png';
import olindaImg from '@/assets/weather-cities/olinda.png';

// Logos dos times
import logoSanta from '@/assets/logo-santa.png';
import logoSport from '@/assets/logo-sport.png';
import logoNautico from '@/assets/logo-nautico.png';
import logoMangary from '@/assets/logo-mangary.png';
import logoPetrolina from '@/assets/logo-petrolina.png';
import logoRetro from '@/assets/logo-retro.png';



const WEATHER_HOURLY: HourPoint[] = [
  { label: '5 AM', value: 27 },
  { label: '8 AM', value: 19 },
  { label: '11 AM', value: 20 },
  { label: '2 PM', value: 25 },
  { label: '5 PM', value: 21 },
  { label: '8 PM', value: 29 },
  { label: '11 PM', value: 21 },
  { label: '2 AM', value: 27 },
];

const WEATHER_WEEKLY: ForecastDay[] = [
  { id: 'tue', label: 'Ter', icon: WEATHER_ICONS.sunny, high: 29, low: 20, isActive: true },
  { id: 'wed', label: 'Qua', icon: WEATHER_ICONS.sunny, high: 29, low: 20 },
  { id: 'thu', label: 'Qui', icon: WEATHER_ICONS.storm, high: 29, low: 20 },
  { id: 'fri', label: 'Sex', icon: WEATHER_ICONS.rainy, high: 29, low: 19 },
  { id: 'sat', label: 'Sab', icon: WEATHER_ICONS.rainy, high: 29, low: 19 },
  { id: 'sun', label: 'Dom', icon: WEATHER_ICONS.clearNight, high: 29, low: 20 },
  { id: 'mon', label: 'Seg', icon: WEATHER_ICONS.sunny, high: 29, low: 20 },
  { id: 'next', label: 'Ter', icon: WEATHER_ICONS.sunny, high: 29, low: 20 },
];

const WEATHER_CITIES: CityWeather[] = [
  {
    id: 'petrolina',
    city: 'Petrolina',
    temp: 32,
    precipitation: '0%',
    humidity: '41%',
    wind: '27 km/h',
    image: petrolinaImg,
    gradient:
      'linear-gradient(161.7deg, rgba(251,68,28,0.91) 0%, rgba(251,202,28,0.6) 99%), linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%)',
    icon: WEATHER_ICONS.sunny,
  },
  {
    id: 'garanhuns',
    city: 'Garanhuns',
    temp: 16,
    precipitation: '18%',
    humidity: '32%',
    wind: '16 km/h',
    image: garanhunImg,
    gradient:
      'linear-gradient(161.7deg, rgba(28,50,251,0.91) 0%, rgba(28,251,224,0.6) 99%), linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%)',
    icon: WEATHER_ICONS.cloudy,
  },
  {
    id: 'caruaru',
    city: 'Caruaru',
    temp: 24,
    precipitation: '70%',
    humidity: '50%',
    wind: '14 km/h',
    image: caruaruImg,
    gradient:
      'linear-gradient(161.7deg, rgba(113,28,251,0.91) 0%, rgba(251,28,148,0.6) 99%), linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%)',
    icon: WEATHER_ICONS.rainy,
  },
  {
    id: 'olinda',
    city: 'Olinda',
    temp: 27,
    precipitation: '10%',
    humidity: '44%',
    wind: '14 km/h',
    image: olindaImg,
    gradient:
      'linear-gradient(161.7deg, rgba(7,156,39,0.91) 0%, rgba(192,255,113,0.6) 99%), linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%)',
    icon: WEATHER_ICONS.sunny,
  },
];

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });



const SCOREBOARD_STANDINGS: StandingRow[] = [
  {
    team: 'Santa Cruz',
    logo: logoSanta,
    stats: { pj: 38, wins: 29, draws: 6, loses: 3, goalsFor: 99, goalsAgainst: 26, points: 93 },
  },
  {
    team: 'Sport',
    logo: logoSport,
    stats: { pj: 38, wins: 28, draws: 8, loses: 2, goalsFor: 94, goalsAgainst: 26, points: 92 },
  },
  {
    team: 'Náutico',
    logo: logoNautico,
    stats: { pj: 38, wins: 21, draws: 11, loses: 6, goalsFor: 76, goalsAgainst: 33, points: 74 },
  },
  {
    team: 'Maguary',
    logo: logoMangary,
    stats: { pj: 38, wins: 22, draws: 3, loses: 13, goalsFor: 69, goalsAgainst: 40, points: 71 },
  },
  {
    team: 'Petrolina',
    logo: logoPetrolina,
    stats: { pj: 38, wins: 22, draws: 3, loses: 13, goalsFor: 61, goalsAgainst: 48, points: 69 },
  },
  {
    team: 'Retrô',
    logo: logoRetro,
    stats: { pj: 38, wins: 16, draws: 10, loses: 12, goalsFor: 57, goalsAgainst: 57, points: 58 },
  },
];

const MATCH_HIGHLIGHT: MatchHighlight = {
  leftTeam: {
    name: 'Sport',
    logo: logoSport,
  },
  rightTeam: {
    name: 'Santa Cruz',
    logo: logoSanta,
  },
  schedule: 'Domingo, 15 de Dezembro - 16h00',
  category: 'Campeonato Pernambucano',
};

/**
 * Componente Home (Página Principal)
 * * Responsável por orquestrar a exibição dos principais componentes da página inicial,
 * buscar dados de notícias e controlar o acesso a funcionalidades administrativas.
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const { news, loading, error } = useNews({ autoFetch: true, initialData: MOCK_NEWS as unknown as News[] });

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

  // Filtrar notícias por prioridade
  // Priority 3 = Urgente (Headlines)
  // Priority 2 = Alta (Highlights - Destaques e Em Alta)
  // Priority 1 = Normal (Top Posts, Novos Posts)

  const urgentNews = newsWithAuthors.filter(n => n.priority === 3);
  const highPriorityNews = newsWithAuthors.filter(n => n.priority === 2);
const normalNews = newsWithAuthors.filter(n => n.priority === 1 || !n.priority);

  // Headlines: Notícias Urgentes (priority=3)
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



  // Helper: Obter o primeiro dia do mês atual
  const getCurrentMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  // Helper: Obter o primeiro dia do mês passado
  const getLastMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  };

  // Helper: Filtrar posts de um período específico
  const filterPostsByPeriod = (newsList: typeof newsWithAuthors, startDate: Date, endDate?: Date) => {
    return newsList.filter(item => {
      if (!item.publicationDate) return false;
      const pubDate = new Date(item.publicationDate);
      if (endDate) {
        return pubDate >= startDate && pubDate < endDate;
      }
      return pubDate >= startDate;
    });
  };

  // Filtrar posts do mês atual e do mês passado
  const currentMonthStart = getCurrentMonthStart();
  const lastMonthStart = getLastMonthStart();
  const currentMonthNews = filterPostsByPeriod(newsWithAuthors, currentMonthStart);
  const lastMonthNews = filterPostsByPeriod(newsWithAuthors, lastMonthStart, currentMonthStart);

  // Em Alta (trendyPosts): Posts mais bem avaliados do mês
  // Ordenar por averageRating (maior primeiro) e pegar os 4 primeiros
  let topRatedThisMonth = [...currentMonthNews]
    .filter(item => item.averageRating && item.averageRating > 0)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 4);

  // Fallback nível 1: se não tiver dados suficientes do mês atual, usar do mês passado
  if (topRatedThisMonth.length < 4) {
    const topRatedLastMonth = [...lastMonthNews]
      .filter(item => item.averageRating && item.averageRating > 0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 4 - topRatedThisMonth.length);

    topRatedThisMonth = [...topRatedThisMonth, ...topRatedLastMonth];
  }

  // Fallback nível 2: se ainda não tiver dados, usar posts de alta prioridade
  if (topRatedThisMonth.length < 4) {
    const fallbackPosts = highPriorityNews
      .filter(item => !topRatedThisMonth.find(p => p.id === item.id))
      .slice(0, 4 - topRatedThisMonth.length);

    topRatedThisMonth = [...topRatedThisMonth, ...fallbackPosts];
  }

  // Mais lidos (topPosts): Posts com mais visualizações do mês
  // Ordenar por readCount (maior primeiro) e pegar os 4 primeiros
  let mostReadThisMonth = [...currentMonthNews]
    .filter(item => item.readCount && item.readCount > 0)
    .sort((a, b) => (b.readCount || 0) - (a.readCount || 0))
    .slice(0, 4);

  // Fallback nível 1: se não tiver dados suficientes do mês atual, usar do mês passado
  if (mostReadThisMonth.length < 4) {
    const mostReadLastMonth = [...lastMonthNews]
      .filter(item => item.readCount && item.readCount > 0)
      .sort((a, b) => (b.readCount || 0) - (a.readCount || 0))
      .slice(0, 4 - mostReadThisMonth.length);

    mostReadThisMonth = [...mostReadThisMonth, ...mostReadLastMonth];
  }

  // Fallback nível 2: se ainda não tiver dados, usar posts normais mais recentes
  if (mostReadThisMonth.length < 4) {
    const fallbackPosts = normalNews
      .filter(item => !mostReadThisMonth.find(p => p.id === item.id))
      .slice(0, 4 - mostReadThisMonth.length);

    mostReadThisMonth = [...mostReadThisMonth, ...fallbackPosts];
  }

  // Mapear para PostPreview
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

  // Popular Posts (Destaques): Alta Prioridade (priority=2)
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

  // New Posts: Prioridade Normal (priority=1), posts mais recentes
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
  const videoNews = newsWithAuthors.filter(n => n.mediaType === 'video');
  const videoPosts: VideoPost[] = videoNews.map(n => ({
    id: n.id || '',
    title: n.title,
    description: n.summary || '',
    imageUrl: getVideoThumbnail(n.featuredImageUrl),
    slug: n.slug || ''
  }));

  const videoHighlight = videoPosts.length > 0 ? videoPosts[0] : null;
  const latestVideos = videoPosts.length > 1 ? videoPosts.slice(1, 5) : [];

  const weatherMain = {
    city: 'Recife, PE',
    datetime: 'Quarta-feira 04:00',
    temp: 29,
    weatherIcon: WEATHER_ICONS.sunny,
    precipitation: '2%',
    humidity: '70%',
    wind: '3 km/h',
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-dark">
        Carregando destaques...
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
        <TagCarousel />

        <Headlines
          singleContentItems={singleContentItems}
          sliderSlides={sliderSlides}
        />

        {highlightsPosts.length > 0 && (
          <Highlights title="Destaques" posts={highlightsPosts} />
        )}

        <SportsScoreboard
          standings={SCOREBOARD_STANDINGS}
          highlight={MATCH_HIGHLIGHT}
        />

        {newPosts.length > 0 && (
          <NewPostsSection posts={newPosts} onShowAll={() => navigate('/noticias')} />
        )}


        {videoHighlight && (
          <LatestVideosSection highlight={videoHighlight} posts={latestVideos} />
        )}

        {trendyPosts.length > 0 && (
          <Highlights title="em alta" posts={trendyPosts} />
        )}

        <WeatherSection
          mainCity={weatherMain}
          hourly={WEATHER_HOURLY}
          weekly={WEATHER_WEEKLY}
          cities={WEATHER_CITIES}
          />

         {topPosts.length > 0 && (
          <Highlights title="Mais lidos" posts={topPosts} disableLeftArrow />
        )}
      </div>
    </div>
  );
};

export default Home;
