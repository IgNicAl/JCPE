import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService } from '@/lib/api';
import '../CreateNews/CreateNews.css'; // NOTE: Reutiliza o CSS da página de criação.

const INITIAL_FORM_STATE = {
  titulo: '',
  subtitulo: '',
  resumo: '',
  conteudo: '',
  imagemUrl: '',
  prioridade: 1,
};

/**
 * @description Página com formulário para editar uma notícia existente.
 * Carrega os dados da notícia com base no ID da URL.
 * @returns {JSX.Element} A página de edição de notícia.
 */
function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await newsService.getById(id);
        setFormData(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar notícia. Tente novamente.' });
        console.error('Erro ao carregar notícia:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [id]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: name === 'prioridade' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await newsService.update(id, formData);
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
      <div className="create-news-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <div className="create-news-header">
          <h1><i className="fas fa-edit" /> Editar Notícia</h1>
          <p>Atualize os detalhes da notícia abaixo</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-news-form">
          {/* O código do formulário JSX foi omitido por ser repetitivo, mas estaria aqui */}
        </form>
      </div>
    </div>
  );
}

export default EditNews;
