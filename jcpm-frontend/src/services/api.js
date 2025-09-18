import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  createUsuario: (usuario) => api.post('/usuarios', usuario),
  
  // Atualizar usuário
  updateUsuario: (id, usuario) => api.put(`/usuarios/${id}`, usuario),
  
  // Deletar usuário
  deleteUsuario: (id) => api.delete(`/usuarios/${id}`),
  
  // Login de usuário
  login: (credentials) => api.post('/usuarios/login', credentials),
};

// Serviços relacionados a notícias
export const noticiaService = {
  // Listar todas as notícias
  getAllNoticias: () => api.get('/noticias'),

  // Buscar notícia por ID
  getNoticiaById: (id) => api.get(`/noticias/${id}`),
};

export default api;
