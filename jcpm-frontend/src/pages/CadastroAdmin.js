import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/api';
import './CadastroAdmin.css';

const CadastroAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    biografia: '',
    urlImagemPerfil: '',
    tipoUsuario: 'JORNALISTA',
    adminPassword: '' // Senha especial para verificar se é admin
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user, isAdmin } = useAuth();
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
      // Verificar se o usuário está logado e é admin
      if (!user || !isAdmin()) {
        setMessage({ 
          type: 'error', 
          text: 'Acesso negado. Apenas administradores podem cadastrar jornalistas.' 
        });
        return;
      }

      // Verificar senha especial do admin
      if (formData.adminPassword !== 'admcesar') {
        setMessage({ 
          type: 'error', 
          text: 'Senha de administrador incorreta.' 
        });
        return;
      }

      // Validações básicas
      if (!formData.username || !formData.email || !formData.password || !formData.nome) {
        setMessage({ 
          type: 'error', 
          text: 'Por favor, preencha todos os campos obrigatórios.' 
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ 
          type: 'error', 
          text: 'As senhas não coincidem.' 
        });
        return;
      }

      if (formData.password.length < 6) {
        setMessage({ 
          type: 'error', 
          text: 'A senha deve ter pelo menos 6 caracteres.' 
        });
        return;
      }

      // Chamada para a API de cadastro
      const response = await usuarioService.createUsuario({
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
        text: `${formData.tipoUsuario} cadastrado com sucesso!` 
      });
      
      // Limpar formulário
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        nome: '',
        biografia: '',
        urlImagemPerfil: '',
        tipoUsuario: 'JORNALISTA',
        adminPassword: ''
      });
      
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      
      if (error.response?.status === 400) {
        if (error.response.data?.includes('Username')) {
          errorMessage = 'Username já está em uso.';
        } else if (error.response.data?.includes('Email')) {
          errorMessage = 'Email já está em uso.';
        } else {
          errorMessage = error.response.data || errorMessage;
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

  // Se não for admin, redirecionar
  if (!user || !isAdmin()) {
    navigate('/');
    return null;
  }

  return (
    <div className="cadastro-admin-container">
      <div className="cadastro-admin-card">
        <div className="cadastro-admin-header">
          <h1><i className="fas fa-user-shield"></i> Cadastro de Jornalistas</h1>
          <p>Cadastre jornalistas e pessoas autorizadas a postar notícias</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-admin-form">
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
              <option value="JORNALISTA">Jornalista</option>
              <option value="ADMIN">Administrador</option>
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

          <div className="form-group admin-password">
            <label htmlFor="adminPassword">
              <i className="fas fa-key"></i> Senha de Administrador *
            </label>
            <input
              type="password"
              id="adminPassword"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              required
              placeholder="Digite a senha de administrador"
            />
            <small>Confirme sua identidade como administrador</small>
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

        <div className="cadastro-admin-footer">
          <p>
            <i className="fas fa-info-circle"></i>
            Esta página é restrita a administradores. Use a senha especial para confirmar sua identidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroAdmin;
