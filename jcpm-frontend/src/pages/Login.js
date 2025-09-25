import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api'; // Alterado para authService
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.username || !formData.password) {
        setMessage({ 
          type: 'error', 
          text: 'Por favor, preencha todos os campos.' 
        });
        return;
      }

      // Chamada para a API de login usando o serviço de autenticação correto
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      // Se chegou aqui, o login foi bem-sucedido
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        nome: response.data.nome,
        tipoUsuario: response.data.tipoUsuario,
        token: response.data.accessToken
      };
      
      login(userData);
      setMessage({ 
        type: 'success', 
        text: 'Login realizado com sucesso!' 
      });
      
      // Redirecionar para a página principal após 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      // Tratar erros da API
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.response?.status === 401) {
        errorMessage = error.response.data?.message || 'Username ou senha incorretos.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1><i className="fas fa-sign-in-alt"></i> Login</h1>
          <p>Entre com suas credenciais para acessar o sistema</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Digite seu username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Senha *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Entrando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta? 
            <a href="/cadastro">
              <i className="fas fa-user-plus"></i> Cadastre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
