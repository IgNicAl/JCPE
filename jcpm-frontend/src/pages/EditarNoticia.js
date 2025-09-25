import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { noticiaService } from '../services/api';
import './CriarNoticia.css'; // Reutilizando o mesmo CSS

const EditarNoticia = () => {
  const { id } = useParams();
  const { user, isAdmin, isJornalista } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    urlImagemDestaque: '',
    prioridade: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const carregarNoticia = useCallback(async () => {
    try {
      const response = await noticiaService.getNoticiaById(id);
      const { titulo, resumo, conteudo, urlImagemDestaque, prioridade } = response.data;
      setFormData({ titulo, resumo, conteudo, urlImagemDestaque, prioridade });
    } catch (error) {
      setMessage({ type: 'error', text: 'Não foi possível carregar os dados da notícia.' });
      console.error('Erro ao carregar notícia:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarNoticia();
  }, [carregarNoticia]);

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
        prioridade: parseInt(formData.prioridade, 10),
      };

      await noticiaService.updateNoticia(id, noticiaData);

      setMessage({
        type: 'success',
        text: 'Notícia atualizada com sucesso! Redirecionando...'
      });

      setTimeout(() => {
        navigate('/noticias/gerenciar');
      }, 2000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao atualizar a notícia.'
      });
      console.error('Erro ao atualizar notícia:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="criar-noticia-container"><p>Carregando dados da notícia...</p></div>;
  }

  return (
    <div className="criar-noticia-container">
      <div className="criar-noticia-card">
        <div className="criar-noticia-header">
          <h1><i className="fas fa-edit"></i> Editar Notícia</h1>
          <p>Altere os campos abaixo para atualizar a publicação.</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="criar-noticia-form">
          {/* Os campos do formulário são os mesmos de CriarNoticia.js */}
          <div className="form-group">
            <label htmlFor="titulo">Título da Notícia *</label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="resumo">Resumo (Subtítulo) *</label>
            <input type="text" id="resumo" name="resumo" value={formData.resumo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="conteudo">Conteúdo Completo *</label>
            <textarea id="conteudo" name="conteudo" value={formData.conteudo} onChange={handleChange} required rows="10" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="urlImagemDestaque">URL da Imagem de Destaque *</label>
              <input type="url" id="urlImagemDestaque" name="urlImagemDestaque" value={formData.urlImagemDestaque} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="prioridade">Prioridade de Destaque *</label>
              <select id="prioridade" name="prioridade" value={formData.prioridade} onChange={handleChange} required>
                <option value="2">Destaque Principal</option>
                <option value="1">Destaque Secundário</option>
                <option value="0">Notícia Comum</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarNoticia;