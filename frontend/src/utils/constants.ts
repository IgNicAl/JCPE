/**
 * Constantes da aplicação
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  INTERNAL_REGISTER: '/cadastro-interno',
  ADMIN_REGISTER: '/cadastro-admin',
  MANAGE_NEWS: '/noticias/gerenciar',
  CREATE_NEWS: '/noticias/criar',
  EDIT_NEWS: '/noticias/editar',
  MANAGE_USERS: '/users',
  EDIT_USER: '/admin/usuarios/editar',
  NEWS_PAGE: '/noticia',
  CHAT_AI: '/chat',
  POINTS: '/pontos',
  PROFILE: '/perfil',
  CLIMA: '/clima',
  RECIFE: '/recife',
  EMPREENDEDORISMO: '/empreendedorismo',
  JOGOS: '/jogos',
} as const;

export interface NewsCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: 'noticias', label: 'Notícias', icon: 'fa-newspaper', color: '#c41e3a' },
  { id: 'esportes', label: 'Esportes', icon: 'fa-futbol', color: '#00aa44' },
  { id: 'politica', label: 'Política', icon: 'fa-landmark', color: '#003d82' },
  { id: 'economia', label: 'Economia', icon: 'fa-chart-line', color: '#ffc107' },
];

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  JOURNALIST: 'JOURNALIST',
} as const;

export const NEWS_PRIORITIES = {
  NORMAL: 1,
  HIGH: 2,
  URGENT: 3,
} as const;

export interface NewsPage {
  value: string;
  label: string;
}

export const NEWS_PAGES: NewsPage[] = [
  { value: 'noticias', label: 'Página Notícias' },
  { value: 'recife', label: 'Recife em 5 Minutos' },
  { value: 'clima', label: 'Clima' },
  { value: 'empreendedorismo', label: 'Empreendedorismo' },
  { value: 'jogos', label: 'Jogos' },
];

export const NEWS_STATUS = {
  DRAFT: 'RASCUNHO',
  PUBLISHED: 'PUBLICADO',
  ARCHIVED: 'ARQUIVADO',
} as const;

