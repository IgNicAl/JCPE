import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNews } from '@/hooks/useNews';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/atoms/Button';
import Highlights from './components/Highlights';
import { MOCK_NEWS } from '@/features/news/mocks/news';
import { News } from '@/types';
import TagCarousel, { TagItem } from './components/TagCarousel';
import PostGridSection from './components/PostGridSection';
import NewPostsSection from './components/NewPostsSection';
import LatestVideosSection, { VideoPost } from './components/LatestVideosSection';
import { getVideoThumbnail } from '@/utils/videoUtils';
import WeatherSection, {
  HourPoint,
  ForecastDay,
  CityWeather,
} from './components/WeatherSection';
import SportsScoreboard, {
  CalendarDay,
  StandingRow,
  MatchHighlight,
} from './components/SportsScoreboard';
import { PostPreview } from './components/PostCardVertical';
import { WEATHER_ICONS } from '@/utils/weatherIcons';
import petrolinaImg from '@/assets/weather-cities/petrolina.png';
import garanhunImg from '@/assets/weather-cities/garanhuns.png';
import caruaruImg from '@/assets/weather-cities/caruaru.png';
import olindaImg from '@/assets/weather-cities/olinda.png';

const TAG_IMAGE_MAP: Record<string, string> = {
  food: 'https://www.figma.com/api/mcp/asset/ab7f8a76-4b72-43cd-a265-82ce679d2e93',
  animal: 'https://www.figma.com/api/mcp/asset/5fb6dac2-711f-493f-b6ab-b693b71a78c8',
  car: 'https://www.figma.com/api/mcp/asset/c02f99a7-ca47-40c7-afec-49b8389e1d25',
  sport: 'https://www.figma.com/api/mcp/asset/d837d745-4cfd-42e7-b9c5-d75a2c6ac2d5',
  music: 'https://www.figma.com/api/mcp/asset/996adbbd-4e54-4cd3-a2f4-21ab926614d9',
  technology: 'https://www.figma.com/api/mcp/asset/3bc382b5-595c-40e7-bffc-ae7fd1b10987',
  abstract: 'https://www.figma.com/api/mcp/asset/84375a82-8e73-4f36-a404-039b32ee258f',
  nature: 'https://www.figma.com/api/mcp/asset/79b3f546-b84d-4dad-b503-cbf8eb95fb62',
};

const TAGS: TagItem[] = [
  { id: 'food', label: '#food', imageUrl: TAG_IMAGE_MAP.food },
  { id: 'animal', label: '#animal', imageUrl: TAG_IMAGE_MAP.animal },
  { id: 'car', label: '#car', imageUrl: TAG_IMAGE_MAP.car },
  { id: 'sport', label: '#sport', imageUrl: TAG_IMAGE_MAP.sport },
  { id: 'music', label: '#music', imageUrl: TAG_IMAGE_MAP.music },
  { id: 'technology', label: '#technology', imageUrl: TAG_IMAGE_MAP.technology },
  { id: 'abstract', label: '#abstract', imageUrl: TAG_IMAGE_MAP.abstract },
  { id: 'nature', label: '#nature', imageUrl: TAG_IMAGE_MAP.nature },
];

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

const buildCalendar = (year: number, month: number): CalendarDay[] => {
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
      isToday: year === 2025 && month === 10 && day === 14,
    });
  }

  while (days.length % 7 !== 0) {
    days.push({ date: null, isCurrentMonth: false });
  }

  return days;
};

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const SCOREBOARD_CALENDAR = {
  monthLabel: 'Nov 2025',
  weekDays: WEEK_DAYS,
  days: buildCalendar(2025, 10),
};

const SCOREBOARD_STANDINGS: StandingRow[] = [
  {
    team: 'Santa Cruz',
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Santa_Cruz_Futebol_Clube_crest.svg',
    stats: { pj: 38, wins: 29, draws: 6, loses: 3, goalsFor: 99, goalsAgainst: 26, points: 93 },
  },
  {
    team: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/16/Sport_Club_do_Recife_logo.svg',
    stats: { pj: 38, wins: 28, draws: 8, loses: 2, goalsFor: 94, goalsAgainst: 26, points: 92 },
  },
  {
    team: 'Náutico',
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Clube_N%C3%A1utico_Capibaribe_logo.svg',
    stats: { pj: 38, wins: 21, draws: 11, loses: 6, goalsFor: 76, goalsAgainst: 33, points: 74 },
  },
  {
    team: 'Manguary',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Football_%28soccer%29_uniform.svg',
    stats: { pj: 38, wins: 22, draws: 3, loses: 13, goalsFor: 69, goalsAgainst: 40, points: 71 },
  },
  {
    team: 'Petrolina',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Football_%28soccer%29_ball.svg',
    stats: { pj: 38, wins: 22, draws: 3, loses: 13, goalsFor: 61, goalsAgainst: 48, points: 69 },
  },
  {
    team: 'Retrô',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Football_%28soccer%29_ball.svg',
    stats: { pj: 38, wins: 16, draws: 10, loses: 12, goalsFor: 57, goalsAgainst: 57, points: 58 },
  },
];

const MATCH_HIGHLIGHT: MatchHighlight = {
  leftTeam: {
    name: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/16/Sport_Club_do_Recife_logo.svg',
  },
  rightTeam: {
    name: 'Santa Cruz',
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Santa_Cruz_Futebol_Clube_crest.svg',
  },
  schedule: 'Sábado, Nov. 14',
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

  const singleContentItems = newsWithAuthors.slice(0, 2).map(news => ({
    id: news.id || '',
    title: news.title,
    summary: news.summary || '',
    imageUrl: getVideoThumbnail(news.featuredImageUrl),
    slug: news.slug || '',
  }));

  const sliderSlides = newsWithAuthors.slice(2, 5).map(news => ({
    id: news.id || '',
    title: news.title,
    summary: news.summary || '',
    imageUrl: getVideoThumbnail(news.featuredImageUrl),
    slug: news.slug || '',
  }));

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

  // Lógica mais flexível para distribuir posts entre as seções
  // Se não houver posts suficientes, vamos duplicar/reciclar os posts existentes
  const totalPosts = posts.length;

  let topPosts: PostPreview[] = [];
  let popularPosts: PostPreview[] = [];
  let newPosts: PostPreview[] = [];
  let trendyPosts: PostPreview[] = [];

  if (totalPosts === 0) {
    // Sem posts, mantém arrays vazias
  } else if (totalPosts < 8) {
    // Se tem menos de 8 posts, vamos duplicar/reciclar para preencher as seções
    const minPostsPerSection = Math.min(4, totalPosts);

    // Top Posts: primeiros posts disponíveis (até 4)
    topPosts = posts.slice(0, minPostsPerSection);

    // Popular Posts: recicla posts do início (pode duplicar se necessário)
    popularPosts = [...posts.slice(0, minPostsPerSection)];
    if (popularPosts.length < 4 && totalPosts > 0) {
      // Preenche duplicando os posts que temos
      while (popularPosts.length < 4) {
        popularPosts.push(...posts.slice(0, Math.min(4 - popularPosts.length, totalPosts)));
      }
    }

    // New Posts: mais posts reciclados
    newPosts = [...posts.slice(0, Math.min(6, totalPosts))];

    // Trendy Posts: mais posts reciclados
    trendyPosts = [...posts.slice(0, minPostsPerSection)];
  } else {
    // Lógica original para quando há posts suficientes
    const takenIds = new Set<string>();
    const pickRange = (start: number, end: number) => {
      const selection = posts.slice(start, end);
      selection.forEach((post) => takenIds.add(post.id));
      return selection;
    };

    const pickNext = (count: number) => {
      const selection = posts.filter((post) => !takenIds.has(post.id)).slice(0, count);
      selection.forEach((post) => takenIds.add(post.id));
      return selection;
    };

    topPosts = pickRange(0, 4);
    popularPosts = pickRange(4, 8);
    newPosts = pickNext(6);
    trendyPosts = pickNext(4);
  }

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
        <TagCarousel tags={TAGS} />

        <Highlights
          singleContentItems={singleContentItems}
          sliderSlides={sliderSlides}
        />

        {popularPosts.length > 0 && (
          <PostGridSection title="Mais populares" posts={popularPosts} />
        )}

        <SportsScoreboard
          calendar={SCOREBOARD_CALENDAR}
          standings={SCOREBOARD_STANDINGS}
          highlight={MATCH_HIGHLIGHT}
        />

        {newPosts.length > 0 && (
          <NewPostsSection posts={newPosts} onShowAll={() => navigate('/noticias')} />
        )}

        {trendyPosts.length > 0 && (
          <PostGridSection title="mais compartilhados" posts={trendyPosts} />
        )}

        {videoHighlight && (
          <LatestVideosSection highlight={videoHighlight} posts={latestVideos} />
        )}

        <WeatherSection
          mainCity={weatherMain}
          hourly={WEATHER_HOURLY}
          weekly={WEATHER_WEEKLY}
          cities={WEATHER_CITIES}
          />

         {topPosts.length > 0 && (
          <PostGridSection title="Mais curtidos" posts={topPosts} disableLeftArrow />
        )}

        {user && (isAdmin() || isJournalist()) && (
          <div className="flex flex-wrap gap-4">
            {isJournalist() && (
              <>
                <Button variant="primary" onClick={() => navigate(ROUTES.CREATE_NEWS)}>
                  <i className="fas fa-plus" /> Criar Notícia
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.MANAGE_NEWS)}>
                  <i className="fas fa-edit" /> Gerenciar
                </Button>
              </>
            )}
            {/* Admin também vê as ações de Jornalista (assumindo sobreposição de regras) */}
            {/* Se as regras não se sobrepõem, o 'if' do jornalista deve ser 'isJournalist() && !isAdmin()' */}
            {isAdmin() && (
              <>
                <Button variant="primary" onClick={() => navigate(ROUTES.MANAGE_USERS)}>
                  <i className="fas fa-users" /> Usuários
                </Button>
                <Button variant="primary" onClick={() => navigate(ROUTES.ADMIN_REGISTER)}>
                  <i className="fas fa-user-plus" /> Novo Admin
                </Button>
                <Button variant="primary" onClick={() => navigate(ROUTES.CREATE_NEWS)}>
                  <i className="fas fa-plus" /> Criar
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.MANAGE_NEWS)}>
                  <i className="fas fa-cogs" /> Gerenciar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
