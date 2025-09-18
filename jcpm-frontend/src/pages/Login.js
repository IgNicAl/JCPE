import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
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
      if (!formData.email || !formData.senha) {
        setMessage({ 
          type: 'error', 
          text: 'Por favor, preencha todos os campos.' 
        });
        return;
      }

      // Chamada real para a API de login
      const response = await usuarioService.login({
        email: formData.email,
        senha: formData.senha
      });
      
      // Se chegou aqui, o login foi bem-sucedido
      const userData = {
        id: response.data.id,
        email: response.data.email,
        nome: response.data.nome,
        sexo: response.data.sexo,
        dataNascimento: response.data.dataNascimento
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
        errorMessage = error.response.data?.message || 'Email ou senha incorretos.';
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
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              <i className="fas fa-lock"></i> Senha *
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
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
