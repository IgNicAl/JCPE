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
  content?: unknown;
  excerpt?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  [key: string]: unknown;
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

