import axios from 'axios';

/**
 * Instância principal do Axios para todas as chamadas de API.
 */
const api = axios.create({
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
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de Resposta:
 * Observa todas as respostas da API. Se receber um erro 401 (Não Autorizado),
 * desloga o usuário (limpa o localStorage) e dispara um evento global
 * 'unauthorized' para que o App.jsx possa redirecionar para o login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    if (error.response?.status === 401) {
        localStorage.removeItem('user');
        // Dispara o evento que o App.jsx está ouvindo
        window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

/**
 * Serviços de Autenticação (Login/Registro)
 */
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

/**
 * Serviços relacionados a Usuários (Admin e Perfil)
 */
export const userService = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, user) => api.put(`/api/users/${id}`, user),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  sendScreenTime: (seconds) => api.post('/api/users/me/screentime', { seconds }),
  getMyPoints: () => api.get('/api/users/me/points'),
  getMyProfile: () => api.get('/api/users/me'),
};

/**
 * Serviços de Notícias (CRUD)
 */
export const newsService = {
  getAll: (page) => api.get('/api/noticias' + (page ? `?page=${encodeURIComponent(page)}` : '')),
  getBySlug: (slug) => api.get(`/api/noticias/slug/${slug}`),
  getAllForManagement: () => api.get('/api/noticias/manage'),
  getById: (id) => api.get(`/api/noticias/${id}`),
  create: (newsData) => api.post('/api/noticias', newsData),
  update: (id, newsData) => api.put(`/api/noticias/${id}`, newsData),
  delete: (id) => api.delete(`/api/noticias/${id}`),
};

/**
 * NOVO: Serviços do Agente de IA
 * Este serviço chama o proxy '/agent-api' que definimos no vite.config.js
 */
export const agentService = {
  /**
   * Envia uma mensagem para o agente de IA e obtém uma resposta.
   * @param {string} userId - O ID do usuário (vem do AuthContext)
   * @param {string} query - A pergunta do usuário
   * @returns {Promise<object>} A resposta da API do agente.
   */
  chat: (userId, query) => api.post('/agent-api/chat', {
    userId: userId, // O backend Python espera 'userId'
    query: query
  }),
};

export default api;
