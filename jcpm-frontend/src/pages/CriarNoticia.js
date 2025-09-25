import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { noticiaService } from '../services/api';
import './CriarNoticia.css';

const CriarNoticia = () => {
  const { user, isAdmin, isJornalista } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    urlImagemDestaque: '',
    prioridade: 0, // 0: Comum, 1: Secundário, 2: Principal
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
      const noticiaData = {
        ...formData,
        autorId: user.id, // Associa o ID do usuário logado como autor
        prioridade: parseInt(formData.prioridade, 10),
      };

      await noticiaService.createNoticia(noticiaData);

      setMessage({
        type: 'success',
        text: 'Notícia publicada com sucesso! Redirecionando...'
      });

      setTimeout(() => {
        navigate('/noticias/gerenciar'); // Redireciona para a lista de notícias
      }, 2000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao publicar a notícia.'
      });
      console.error('Erro ao criar notícia:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-noticia-container">
      <div className="criar-noticia-card">
        <div className="criar-noticia-header">
          <h1><i className="fas fa-newspaper"></i> Publicar Nova Notícia</h1>
          <p>Preencha os campos abaixo para criar uma nova publicação.</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="criar-noticia-form">
          <div className="form-group">
            <label htmlFor="titulo">
              <i className="fas fa-heading"></i> Título da Notícia *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ex: Economia brasileira mostra sinais de recuperação"
            />
          </div>

          <div className="form-group">
            <label htmlFor="resumo">
              <i className="fas fa-align-left"></i> Resumo (Subtítulo) *
            </label>
            <input
              type="text"
              id="resumo"
              name="resumo"
              value={formData.resumo}
              onChange={handleChange}
              required
              placeholder="Um resumo curto que aparecerá nos cards da home"
            />
          </div>

          <div className="form-group">
            <label htmlFor="conteudo">
              <i className="fas fa-file-alt"></i> Conteúdo Completo *
            </label>
            <textarea
              id="conteudo"
              name="conteudo"
              value={formData.conteudo}
              onChange={handleChange}
              required
              placeholder="Digite o corpo da notícia aqui..."
              rows="10"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="urlImagemDestaque">
                <i className="fas fa-image"></i> URL da Imagem de Destaque *
              </label>
              <input
                type="url"
                id="urlImagemDestaque"
                name="urlImagemDestaque"
                value={formData.urlImagemDestaque}
                onChange={handleChange}
                required
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prioridade">
                <i className="fas fa-star"></i> Prioridade de Destaque *
              </label>
              <select
                id="prioridade"
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                required
              >
                <option value="2">Destaque Principal (Card Grande)</option>
                <option value="1">Destaque Secundário (Card Médio)</option>
                <option value="0">Notícia Comum (Cards Menores)</option>
              </select>
              <small>Define a posição da notícia na página inicial.</small>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Publicando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Publicar Notícia
              </>
            )}
          </button>
        </form>

        <div className="criar-noticia-footer">
          <p>
            <i className="fas fa-info-circle"></i>
            Você está publicando como <strong>{user?.nome}</strong> ({user?.tipoUsuario}).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriarNoticia;