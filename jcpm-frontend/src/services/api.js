import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const usuarioService = {
  // Listar todos os usuários
  getAllUsuarios: () => api.get('/usuarios'),
  
  // Buscar usuário por ID
  getUsuarioById: (id) => api.get(`/usuarios/${id}`),
  
  // Criar novo usuário
  createUsuario: (usuario) => api.post('/auth/register', usuario),
  
  // Atualizar usuário
  updateUsuario: (id, usuario) => api.put(`/usuarios/${id}`, usuario),
  
  // Deletar usuário
  deleteUsuario: (id) => api.delete(`/usuarios/${id}`),
  
  // Login de usuário (sistema antigo)
  login: (credentials) => api.post('/usuarios/login', credentials),
};

// Serviços de autenticação com JWT
export const authService = {
  // Login com JWT
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Registro de novo usuário/admin
  register: (userData) => api.post('/auth/register', userData),
};

// Serviços relacionados a notícias
export const noticiaService = {
  // Listar todas as notícias
  getAllNoticias: () => api.get('/noticias'),

  // Buscar notícia por ID
  getNoticiaById: (id) => api.get(`/noticias/${id}`),

  // Criar uma nova notícia
  createNoticia: (noticiaData) => api.post('/noticias', noticiaData),

  // Atualizar uma notícia existente
  updateNoticia: (id, noticiaData) => api.put(`/noticias/${id}`, noticiaData),

  // Excluir uma notícia
  deleteNoticia: (id) => api.delete(`/noticias/${id}`),
};

export default api;
