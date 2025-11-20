import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { User } from '@/types';

/**
 * Instância principal do Axios para todas as chamadas de API.
 */
const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Requisição:
 * Pega o token JWT do localStorage (se o usuário estiver logado)
 * e o injeta no header 'Authorization' de cada requisição.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString) as User;
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Interceptor de Resposta:
 * Observa todas as respostas da API. Se receber um erro 401 (Não Autorizado),
 * desloga o usuário (limpa o localStorage) e dispara um evento global
 * 'unauthorized' para que o App.tsx possa redirecionar para o login.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('Erro na API:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // Dispara o evento que o App.tsx está ouvindo
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  userType?: string;
  [key: string]: unknown;
}

/**
 * Serviços de Autenticação (Login/Registro)
 */
export const authService = {
  login: (credentials: LoginCredentials) => api.post('/api/auth/login', credentials),
  register: (userData: RegisterData) => api.post('/api/auth/register', userData),
};

/**
 * Serviços relacionados a Usuários (Admin e Perfil)
 */
export const userService = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id: string) => api.get(`/api/users/${id}`),
  updateUser: (id: string, user: Partial<User>) => api.put(`/api/users/${id}`, user),
  updateMyProfile: (user: Partial<User>) => api.put('/api/users/me', user),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
  sendScreenTime: (seconds: number) => api.post('/api/users/me/screentime', { seconds }),
  getMyPoints: () => api.get('/api/users/me/points'),
  getMyProfile: () => api.get('/api/users/me'),
};

/**
 * Serviços de Notícias (CRUD)
 */
export const newsService = {
  getAll: (page?: string, featuredHome?: boolean, featuredPage?: boolean) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (featuredHome !== undefined) params.append('featuredHome', String(featuredHome));
    if (featuredPage !== undefined) params.append('featuredPage', String(featuredPage));
    const queryString = params.toString();
    return api.get('/api/noticias' + (queryString ? `?${queryString}` : ''));
  },
  getBySlug: (slug: string) => api.get(`/api/noticias/slug/${slug}`),
  getAllForManagement: () => api.get('/api/noticias/manage'),
  getById: (id: string) => api.get(`/api/noticias/${id}`),
  create: (newsData: unknown) => api.post('/api/noticias', newsData),
  update: (id: string, newsData: unknown) => api.put(`/api/noticias/${id}`, newsData),
  delete: (id: string) => api.delete(`/api/noticias/${id}`),
  // Métodos de like
  getLikedNews: () => api.get('/api/noticias/liked'),
  likeNews: (newsId: string) => api.post(`/api/noticias/${newsId}/like`),
  unlikeNews: (newsId: string) => api.delete(`/api/noticias/${newsId}/like`),
};


/**
 * NOVO: Serviços do Agente de IA
 * Este serviço chama o proxy '/agent-api' que definimos no vite.config.ts
 */
export const agentService = {
  /**
   * Envia uma mensagem para o agente de IA e obtém uma resposta.
   * @param {string} userId - O ID do usuário (vem do AuthContext)
   * @param {string} query - A pergunta do usuário
   * @returns {Promise<object>} A resposta da API do agente.
   */
  chat: (userId: string, query: string) =>
    api.post('/agent-api/chat', {
      userId: userId,
      query: query,
    }),
};

export default api;

