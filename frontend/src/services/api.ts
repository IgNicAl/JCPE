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

  // Métodos de rating (avaliação)
  rateNews: (newsId: string, rating: number) => api.post(`/api/noticias/${newsId}/rate`, { rating }),
  getNewsRating: (newsId: string) => api.get(`/api/noticias/${newsId}/rating`),
  getUserRating: (newsId: string) => api.get(`/api/noticias/${newsId}/user-rating`),

  // Métodos de comentários
  getNewsComments: (newsId: string) => api.get(`/api/noticias/${newsId}/comments`),
  addComment: (newsId: string, content: string, parentId?: string) => api.post(`/api/noticias/${newsId}/comments`, { content, parentId }),
  deleteComment: (commentId: string) => api.delete(`/api/noticias/comments/${commentId}`),

  // Métodos de compartilhamento
  shareNews: (newsId: string) => api.post(`/api/noticias/${newsId}/share`),

  // Estatísticas gerais
  getNewsStats: (newsId: string) => api.get(`/api/noticias/${newsId}/stats`),
  getAuthorPostCount: (authorId: string) => api.get(`/api/noticias/author/${authorId}/count`),
  getTopNews: () => api.get('/api/noticias/top'),
};

/**
 * Serviços de Categorias
 */
export const categoryService = {
  getAll: () => api.get('/api/categories'),
  getById: (id: string) => api.get(`/api/categories/${id}`),
  create: (categoryData: unknown) => api.post('/api/categories', categoryData),
  update: (id: string, categoryData: unknown) => api.put(`/api/categories/${id}`, categoryData),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
};

/**
 * Serviços de Tags
 */
export const tagService = {
  getAll: () => api.get('/api/tags'),
  search: (query: string) => api.get(`/api/tags/search?query=${encodeURIComponent(query)}`),
  getById: (id: string) => api.get(`/api/tags/${id}`),
  create: (tagData: unknown) => api.post('/api/tags', tagData),
  delete: (id: string) => api.delete(`/api/tags/${id}`),
};

/**
 * Serviços de Upload de Mídia
 */
export const mediaService = {
  /**
   * Faz upload de um arquivo de mídia (imagem ou vídeo).
   * @param file Arquivo a ser enviado
   * @param onProgress Callback para progresso do upload
   * @returns Promise com a URL do arquivo carregado
   */
  uploadFile: (file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },

  /**
   * Valida uma URL externa e detecta o tipo de mídia.
   * @param url URL a ser validada
   * @returns Promise com informações sobre a URL
   */
  validateUrl: (url: string): Promise<AxiosResponse> => {
    return api.post('/api/media/validate-url', { url });
  },
};

/**
 * Serviços de Revisão de Notícias
 */
export const newsReviewService = {
  getPendingReviews: () => api.get('/api/news/review/pending'),
  getReviewedNews: () => api.get('/api/news/review/reviewed'),
  submitForReview: (newsId: string) => api.post(`/api/news/review/${newsId}/submit`),
  approveNews: (newsId: string, data: unknown) => api.post(`/api/news/review/${newsId}/approve`, data),
  rejectNews: (newsId: string, comment: string) => api.post(`/api/news/review/${newsId}/reject`, { comment }),
  requestChanges: (newsId: string, comment: string) => api.post(`/api/news/review/${newsId}/request-changes`, { comment }),
  getReviewHistory: (newsId: string) => api.get(`/api/news/review/${newsId}/history`),
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

