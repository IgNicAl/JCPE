import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/lib/api';
import './CreateNews.css';

const INITIAL_FORM_STATE = {
  titulo: '',
  subtitulo: '',
  resumo: '',
  conteudo: '',
  imagemUrl: '',
  prioridade: 1,
};

/**
 * @description Página com formulário para criação de uma nova notícia.
 * Acessível por jornalistas e administradores.
 * @returns {JSX.Element} A página de criação de notícia.
 */
function CreateNews() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      // Garante que o valor da prioridade seja sempre um número.
      [name]: name === 'prioridade' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await newsService.create(formData);
      setMessage({ type: 'success', text: 'Notícia criada com sucesso!' });
      setTimeout(() => {
        navigate('/noticias/gerenciar');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar notícia. Tente novamente.' });
      console.error('Erro ao criar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <div className="create-news-header">
          <h1><i className="fas fa-plus-circle" /> Criar Nova Notícia</h1>
          <p>Preencha os detalhes da nova notícia abaixo</p>
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

export default CreateNews;
