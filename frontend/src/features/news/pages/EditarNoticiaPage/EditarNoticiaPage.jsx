import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noticiaService } from '@/lib/api';
import '../CriarNoticiaPage/CriarNoticia.css';

const INITIAL_FORM = {
  titulo: '',
  subtitulo: '',
  resumo: '',
  conteudo: '',
  imagemUrl: '',
  prioridade: 1
};

function EditarNoticia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function carregarNoticia() {
      try {
        const response = await noticiaService.getNoticiaById(id);
        setFormData(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar notícia. Tente novamente.' });
        console.error('Erro ao carregar notícia:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarNoticia();
  }, [id]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: name === 'prioridade' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await noticiaService.updateNoticia(id, formData);
      setMessage({ type: 'success', text: 'Notícia atualizada com sucesso!' });
      setTimeout(() => {
        navigate('/noticias/gerenciar');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar notícia. Tente novamente.' });
      console.error('Erro ao atualizar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="criar-noticia-container">
        <div className="criar-noticia-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando notícia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="criar-noticia-container">
      <div className="criar-noticia-card">
        <div className="criar-noticia-header">
          <h1><i className="fas fa-edit"></i> Editar Notícia</h1>
          <p>Atualize os detalhes da notícia abaixo</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="criar-noticia-form">
          {/* ...existing code... */}
        </form>
      </div>
    </div>
  );
}

export default EditarNoticia;
