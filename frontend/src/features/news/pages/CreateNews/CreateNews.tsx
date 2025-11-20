import { useState, useEffect, useRef, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService, categoryService, tagService } from '@/services/api';
import { Category, Tag } from '@/types';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';

import styles from './CreateNews.module.css';

interface FormState {
  title: string;
  summary: string;
  featuredImageUrl: string;
  priority: number;
  categoryId: string;
  tagIds: string[];
  page: string;
  isFeaturedHome: boolean;
  isFeaturedPage: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  title: '',
  summary: '',
  featuredImageUrl: '',
  priority: 1,
  categoryId: '',
  tagIds: [],
  page: 'noticias',
  isFeaturedHome: false,
  isFeaturedPage: false,
};

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

const CreateNews: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();
  const editorRef = useRef<EditorJS | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Carregar categorias e tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll(),
        ]);
        setCategories(categoriesRes.data);
        setAllTags(tagsRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  // Inicializar Editor.js
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

  // Restaurar rascunho do localStorage
  useEffect(() => {
    const draft = localStorage.getItem('newsDraft');
    if (draft) {
      const draftData = JSON.parse(draft) as FormState & { contentJson?: OutputData; tags?: Tag[] };
      setFormData({
        title: draftData.title || '',
        summary: draftData.summary || '',
        featuredImageUrl: draftData.featuredImageUrl || '',
        priority: draftData.priority || 1,
        categoryId: draftData.categoryId || '',
        tagIds: draftData.tagIds || [],
        page: draftData.page || 'noticias',
        isFeaturedHome: draftData.isFeaturedHome || false,
        isFeaturedPage: draftData.isFeaturedPage || false,
      });
      if (draftData.tags) {
        setSelectedTags(draftData.tags);
      }
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
        const draftData = { ...data, contentJson, tags: selectedTags };
        localStorage.setItem('newsDraft', JSON.stringify(draftData));
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }
  };

  // Gerenciamento de Tags
  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.trim()) {
      const filtered = allTags.filter(tag =>
        tag.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
      );
      setTagSuggestions(filtered);
    } else {
      setTagSuggestions([]);
    }
  };

  const handleTagInputKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      await addTag(tagInput.trim());
    } else if (e.key === 'Backspace' && !tagInput && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  const addTag = async (tagName: string) => {
    // Verificar se já existe
    const existing = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());

    if (existing) {
      if (!selectedTags.find(t => t.id === existing.id)) {
        setSelectedTags([...selectedTags, existing]);
        setFormData(prev => ({ ...prev, tagIds: [...prev.tagIds, existing.id] }));
      }
    } else {
      // Criar nova tag
      try {
        const response = await tagService.create({ name: tagName });
        const newTag = response.data as Tag;
        setAllTags([...allTags, newTag]);
        setSelectedTags([...selectedTags, newTag]);
        setFormData(prev => ({ ...prev, tagIds: [...prev.tagIds, newTag.id] }));
      } catch (error) {
        console.error('Erro ao criar tag:', error);
      }
    }

    setTagInput('');
    setTagSuggestions([]);
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
    setFormData(prev => ({ ...prev, tagIds: prev.tagIds.filter(id => id !== tagId) }));
  };

  const selectSuggestion = (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
      setFormData(prev => ({ ...prev, tagIds: [...prev.tagIds, tag.id] }));
    }
    setTagInput('');
    setTagSuggestions([]);
    tagInputRef.current?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, isDraft = false) => {
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
        status: isDraft ? 'RASCUNHO' : 'PUBLICADO',
        categoryId: formData.categoryId || null,
        tagIds: formData.tagIds,
      };

      console.log('Enviando dados da notícia:', newsData);

      await newsService.create(newsData);
      setMessage({
        type: 'success',
        text: isDraft ? 'Rascunho salvo com sucesso!' : 'Notícia publicada com sucesso!'
      });
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

  const handleDraft = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e, true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Criar Notícia</button>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => setShowPreview(true)}
            disabled={loading}
          >
            <i className="fas fa-eye" /> Preview
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          {message.text}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            {/* Título */}
            <div className={styles.formGroup}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título"
                className={`${styles.input} ${styles.large}`}
                required
              />
            </div>

            {/* Tags */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Add Tags</div>
              <div className={styles.formGroup} style={{ position: 'relative' }}>
                <div
                  className={styles.tagsInput}
                  onClick={() => tagInputRef.current?.focus()}
                >
                  {selectedTags.map(tag => (
                    <span key={tag.id} className={styles.tag}>
                      {tag.name}
                      <button
                        type="button"
                        className={styles.tagRemove}
                        onClick={() => removeTag(tag.id)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Digite para adicionar tags..."
                    className={styles.tagInputField}
                  />
                </div>
                {tagSuggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {tagSuggestions.map(tag => (
                      <div
                        key={tag.id}
                        className={styles.suggestionItem}
                        onClick={() => selectSuggestion(tag)}
                      >
                        {tag.name}
                      </div>
                    ))}
                    {tagInput && !allTags.find(t => t.name.toLowerCase() === tagInput.toLowerCase()) && (
                      <div
                        className={`${styles.suggestionItem} ${styles.createNew}`}
                        onClick={() => addTag(tagInput)}
                      >
                        <i className="fas fa-plus" /> Criar "{tagInput}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Categoria */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Categoria</div>
              <div className={styles.formGroup}>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editor de Conteúdo */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Conteúdo</div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <i className="fas fa-file-alt" /> Descrição completa
                </label>
                <div id="editorjs" className={styles.editorContainer}></div>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={(e) => handleDraft(e as unknown as FormEvent<HTMLFormElement>)}
                disabled={loading}
              >
                <i className="fas fa-save" /> Salvar Rascunho
              </button>
              <button
                type="submit"
                className={`${styles.actionButton} ${styles.primary}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" /> Publicando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" /> Publicar
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={styles.rightColumn}>
            {/* Imagem de Capa */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Imagem de Capa</div>
              <div className={styles.formGroup}>
                <div className={`${styles.imageUploadArea} ${formData.featuredImageUrl ? styles.hasImage : ''}`}>
                  {formData.featuredImageUrl ? (
                    <img src={formData.featuredImageUrl} alt="Preview" className={styles.imagePreview} />
                  ) : (
                    <>
                      <div className={styles.imageUploadIcon}>
                        <i className="fas fa-image" />
                      </div>
                      <div className={styles.imageUploadText}>
                        Drop image here, Paste Or
                      </div>
                      <button type="button" className={styles.selectButton}>
                        Select
                      </button>
                    </>
                  )}
                </div>
                <input
                  type="text"
                  name="featuredImageUrl"
                  value={formData.featuredImageUrl}
                  onChange={handleChange}
                  placeholder="URL da imagem"
                  className={styles.input}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>

            {/* Resumo */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Resumo</div>
              <div className={styles.formGroup}>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Escreva um resumo breve da notícia..."
                  className={styles.input}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Configurações */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Configurações</div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Prioridade</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value={1}>Normal</option>
                  <option value={2}>Alta</option>
                  <option value={3}>Urgente</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isFeaturedHome"
                    checked={formData.isFeaturedHome}
                    onChange={handleCheckboxChange}
                  />
                  <span className={styles.label} style={{ marginBottom: 0 }}>Destaque na Home</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isFeaturedPage"
                    checked={formData.isFeaturedPage}
                    onChange={handleCheckboxChange}
                  />
                  <span className={styles.label} style={{ marginBottom: 0 }}>Destaque na Página</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal de Preview */}
      {showPreview && (
        <div className={styles.previewModal} onClick={() => setShowPreview(false)}>
          <div className={styles.previewContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.previewClose} onClick={() => setShowPreview(false)}>
              ×
            </button>
            <h1>{formData.title || 'Título da Notícia'}</h1>
            {formData.featuredImageUrl && (
              <img src={formData.featuredImageUrl} alt="Preview" style={{ width: '100%', marginTop: '1rem' }} />
            )}
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              {formData.summary || 'Resumo da notícia aparecerá aqui...'}
            </p>
            <div style={{ marginTop: '1rem' }}>
              {selectedTags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedTags.map(tag => (
                    <span key={tag.id} className={styles.tag}>{tag.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNews;
