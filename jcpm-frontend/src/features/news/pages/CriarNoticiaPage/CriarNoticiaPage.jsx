import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticiaService } from '@/lib/api';
import './CriarNoticia.css';

const INITIAL_FORM = {
  titulo: '',
  subtitulo: '',
  resumo: '',
  conteudo: '',
  imagemUrl: '',
  prioridade: 1
};

function CriarNoticia() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prioridade' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await noticiaService.createNoticia(formData);
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
    <div className="criar-noticia-container">
      <div className="criar-noticia-card">
        <div className="criar-noticia-header">
          <h1><i className="fas fa-plus-circle"></i> Criar Nova Notícia</h1>
          <p>Preencha os detalhes da nova notícia abaixo</p>
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

export default CriarNoticia;
