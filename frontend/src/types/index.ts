export type UserType = 'USER' | 'ADMIN' | 'JOURNALIST';

export interface User {
  id?: string;
  name: string;
  email: string;
  userType: UserType;
  token?: string;
  username?: string;
  biografia?: string;
  urlImagemPerfil?: string;
  bannerUrl?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isJournalist: () => boolean;
  loading: boolean;
}

export interface News {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  content?: unknown;
  excerpt?: string;
  featuredImageUrl?: string;
  author?: {
    name: string;
    username?: string;
    profileImageUrl?: string;
  } | string;
  publicationDate?: string;
  likedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  category?: Category;
  tags?: Tag[];
  [key: string]: unknown;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdByName?: string;
  createdAt?: string;
}


export interface NewsRating {
  newsId: string;
  userId: string;
  rating: number;
  ratedAt: string;
}

export interface NewsComment {
  id: string;
  newsId: string;
  user: {
    id: string;
    name: string;
    username?: string;
    urlImagemPerfil?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NewsShare {
  newsId: string;
  userId?: string;
  sharedAt: string;
}

export interface NewsStats {
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  averageRating: number;
  totalRatings: number;
  userHasLiked: boolean;
  userRating?: number;
}


export interface ScreenTimerManager {
  running: boolean;
  accumulated: number;
  lastTick: number | null;
  intervalId: NodeJS.Timeout | null;
}

declare global {
  interface Window {
    __jcpe_screen_timer__?: ScreenTimerManager;
  }
}

