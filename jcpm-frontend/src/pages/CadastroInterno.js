import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './CadastroInterno.css';

const CadastroInterno = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',    
    tipoUsuario: 'ADMIN', // Padrão para ADMIN, pode ser alterado no form
    biografia: '',
    urlImagemPerfil: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
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
      if (formData.password !== formData.confirmPassword) {
        setMessage({ 
          type: 'error', 
          text: 'As senhas não coincidem.' 
        });
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setMessage({ 
          type: 'error', 
          text: 'A senha deve ter pelo menos 6 caracteres.' 
        });
        setLoading(false);
        return;
      }

      // Chamada para a API de cadastro
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nome: formData.nome,
        biografia: formData.biografia,
        urlImagemPerfil: formData.urlImagemPerfil,
        tipoUsuario: formData.tipoUsuario
      });
      
      setMessage({ 
        type: 'success', 
        text: `Usuário ${formData.tipoUsuario.toLowerCase()} cadastrado com sucesso! Redirecionando para login...` 
      });
      
      // Limpar formulário
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        nome: '',
        tipoUsuario: 'ADMIN',
        biografia: '',
        urlImagemPerfil: ''
      });
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      
      // Tratamento de erros mais específico conforme REGISTRO_ADMIN_EXEMPLO.md
      if (error.response?.data?.error) {
        if (error.response.data.error === 'USERNAME_EXISTS') {
          errorMessage = 'Username já está em uso!';
        } else if (error.response.data.error === 'EMAIL_EXISTS') {
          errorMessage = 'Email já está em uso!';
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-interno-container">
      <div className="cadastro-interno-card">
        <div className="cadastro-interno-header">
          <h1><i className="fas fa-cog"></i> Cadastro Interno</h1>
          <p>Use esta página para criar o primeiro Administrador ou novos Jornalistas.</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-interno-form">
          <div className="form-row">
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
                placeholder="Digite o username"
              />
            </div>

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
                placeholder="Digite o e-mail"
              />
            </div>
          </div>

          <div className="form-row">
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
                placeholder="Digite a senha"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i> Confirmar Senha *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirme a senha"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nome">
              <i className="fas fa-id-card"></i> Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoUsuario">
              <i className="fas fa-user-tag"></i> Tipo de Usuário *
            </label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">Administrador</option>
              <option value="JORNALISTA">Jornalista</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="biografia">
              <i className="fas fa-file-text"></i> Biografia
            </label>
            <textarea
              id="biografia"
              name="biografia"
              value={formData.biografia}
              onChange={handleChange}
              placeholder="Digite uma breve biografia"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="urlImagemPerfil">
              <i className="fas fa-image"></i> URL da Imagem de Perfil
            </label>
            <input
              type="url"
              id="urlImagemPerfil"
              name="urlImagemPerfil"
              value={formData.urlImagemPerfil}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
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
                Cadastrando...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Cadastrar {formData.tipoUsuario}
              </>
            )}
          </button>
        </form>

        <div className="cadastro-interno-footer">
          <p>
            <i className="fas fa-info-circle"></i>
            Esta página é destinada ao cadastro inicial de usuários com permissões no sistema.
          </p>
          <div className="login-link">
            <a href="/login">
              <i className="fas fa-sign-in-alt"></i>
              Já tem uma conta? Faça login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroInterno;
