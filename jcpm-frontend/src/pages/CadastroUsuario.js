import React, { useState } from 'react';
import { usuarioService } from '../services/api';
import './CadastroUsuario.css';

const CadastroUsuario = () => {
  const [formData, setFormData] = useState({
    nome: '',
    sexo: '',
    dataNascimento: '',
    email: '',
    senha: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      // Converter dataNascimento para o formato esperado pelo backend
      const usuarioData = {
        ...formData,
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : null
      };

      const response = await usuarioService.createUsuario(usuarioData);
      
      setMessage({ 
        type: 'success', 
        text: 'Usuário cadastrado com sucesso!' 
      });
      
      // Limpar formulário
      setFormData({
        nome: '',
        sexo: '',
        dataNascimento: '',
        email: '',
        senha: ''
      });
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erro ao cadastrar usuário. Tente novamente.' 
      });
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h1><i className="fas fa-user-plus"></i> Cadastro de Usuário</h1>
          <p>Preencha os dados abaixo para criar uma nova conta</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group">
            <label htmlFor="nome">
              <i className="fas fa-user"></i> Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite seu nome completo"
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
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">
              <i className="fas fa-calendar"></i> Data de Nascimento
            </label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sexo">
              <i className="fas fa-venus-mars"></i> Sexo
            </label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
            >
              <option value="">Selecione uma opção</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
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
                <i className="fas fa-save"></i>
                Cadastrar Usuário
              </>
            )}
          </button>
        </form>

        <div className="cadastro-footer">
          <p>
            <a href="/usuarios">
              <i className="fas fa-list"></i> Ver lista de usuários
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuario;


