import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/services/api';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';

import './CreateNews.css';

interface FormState {
  title: string;
  summary: string;
  featuredImageUrl: string;
  priority: number;
  category: string;
  page: string;
  isFeatured: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  title: '',
  summary: '',
  featuredImageUrl: '',
  priority: 1,
  category: 'noticias',
  page: 'noticias',
  isFeatured: false,
};

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface PageOption {
  value: string;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { value: 'noticias', label: 'Notícias' },
  { value: 'esportes', label: 'Esportes' },
  { value: 'politica', label: 'Política' },
  { value: 'economia', label: 'Economia' },
];

const PAGES: PageOption[] = [
  { value: 'noticias', label: 'Página Notícias' },
  { value: 'recife', label: 'Recife em 5 Minutos' },
  { value: 'clima', label: 'Clima' },
  { value: 'empreendedorismo', label: 'Empreendedorismo' },
  { value: 'jogos', label: 'Jogos' },
];

const CreateNews: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const response = await fetch('/api/upload/image', {
                      method: 'POST',
                      body: formData,
                    });
                    const result = await response.json();
                    return {
                      success: 1,
                      file: {
                        url: result.url,
                      },
                    };
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
          embed: Embed,
          quote: Quote,
          table: Table,
          code: CodeTool,
        },
        placeholder: 'Comece a escrever sua notícia aqui...',
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const draft = localStorage.getItem('newsDraft');
    if (draft) {
      const draftData = JSON.parse(draft) as FormState & { contentJson?: OutputData };
      setFormData({
        title: draftData.title || '',
        summary: draftData.summary || '',
        featuredImageUrl: draftData.featuredImageUrl || '',
        priority: draftData.priority || 1,
        category: draftData.category || 'noticias',
        page: draftData.page || 'noticias',
        isFeatured: draftData.isFeatured || false,
      });
      if (editorRef.current && draftData.contentJson) {
        editorRef.current.isReady
          .then(() => {
            editorRef.current?.render(draftData.contentJson!);
          })
          .catch((error) => console.error('Error rendering draft:', error));
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData: FormState = {
      ...formData,
      [name]: name === 'priority' ? parseInt(value, 10) : value,
    } as FormState;
    setFormData(updatedFormData);
    saveDraft(updatedFormData);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedFormData: FormState = {
      ...formData,
      [name]: checked,
    } as FormState;
    setFormData(updatedFormData);
    saveDraft(updatedFormData);
  };

  const saveDraft = async (data: FormState): Promise<void> => {
    if (editorRef.current) {
      try {
        const contentJson = await editorRef.current.save();
        const draftData = { ...data, contentJson };
        localStorage.setItem('newsDraft', JSON.stringify(draftData));
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editorRef.current) return;
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const outputData = await editorRef.current.save();

      if (outputData.blocks.length === 0) {
        setMessage({ type: 'error', text: 'O conteúdo da notícia não pode estar vazio.' });
        setLoading(false);
        return;
      }

      const newsData = {
        ...formData,
        content: JSON.stringify(outputData),
        contentJson: JSON.stringify(outputData),
        status: 'PUBLICADO',
      };

      console.log('Enviando dados da notícia:', newsData);

      await newsService.create(newsData);
      setMessage({ type: 'success', text: 'Notícia criada com sucesso!' });
      localStorage.removeItem('newsDraft');

      setTimeout(() => {
        navigate('/noticias/gerenciar');
      }, 2000);
    } catch (error: unknown) {
      let errorMsg = 'Erro ao criar notícia. Tente novamente.';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      setMessage({ type: 'error', text: errorMsg });
      console.error('Erro ao criar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <div className="create-news-header">
          <h1>
            <i className="fas fa-plus-circle" /> Criar Nova Notícia
          </h1>
          <p>Preencha os detalhes da nova notícia abaixo</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-news-form">
          <div className="form-group">
            <label htmlFor="title">
              <i className="fas fa-heading" /> Título *
            </label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="summary">
              <i className="fas fa-align-left" /> Resumo *
            </label>
            <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="editorjs">
              <i className="fas fa-file-alt" /> Conteúdo Completo *
            </label>
            <div id="editorjs" style={{ border: '1px solid #ccc', borderRadius: '5px', minHeight: '300px' }}></div>
          </div>

          <div className="form-group">
            <label htmlFor="featuredImageUrl">
              <i className="fas fa-image" /> URL da Imagem de Capa
            </label>
            <input type="text" id="featuredImageUrl" name="featuredImageUrl" value={formData.featuredImageUrl} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                <i className="fas fa-folder" /> Seção *
              </label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">
                <i className="fas fa-star" /> Prioridade *
              </label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                <option value={1}>Normal</option>
                <option value={2}>Alta</option>
                <option value={3}>Urgente</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="page">
                <i className="fas fa-file-alt" /> Publicar em *
              </label>
              <select id="page" name="page" value={formData.page} onChange={handleChange}>
                {PAGES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="isFeatured">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleCheckboxChange} />
                <span>
                  <i className="fas fa-certificate" /> Notícia Principal
                </span>
              </label>
              <small>Marca esta notícia como destaque principal na página</small>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Criando...
              </>
            ) : (
              <>
                <i className="fas fa-save" /> Criar Notícia
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;

