import axios from 'axios';

// Corrigido: Removida a URL base hardcoded para permitir que o proxy do Vite funcione.
// As chamadas agora usam caminhos relativos (ex: '/api/auth/login').
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  (config) => {
    // Tenta obter o usuário do localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para logar erros de resposta da API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    // Corrigido: Se o erro for 401 (Não Autorizado), deslogar o usuário para limpar o estado inválido.
    if (error.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redireciona para a página de login
    }
    return Promise.reject(error);
  }
);

// --- Serviços de API Refatorados ---

// Corrigido: Serviço centralizado para autenticação
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

// Corrigido: Serviço focado em gerenciamento de usuários (para admins)
export const userService = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, usuario) => api.put(`/api/users/${id}`, usuario),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

// Serviço para gerenciamento de notícias
export const noticiaService = {
  getAllNoticias: () => api.get('/api/noticias'),
  getNoticiaById: (id) => api.get(`/api/noticias/${id}`),
  createNoticia: (noticiaData) => api.post('/api/noticias', noticiaData),
  updateNoticia: (id, noticiaData) => api.put(`/api/noticias/${id}`, noticiaData),
  deleteNoticia: (id) => api.delete(`/api/noticias/${id}`),
};

export default api;
