import { useState, useEffect, useRef, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import MediaSelector from '@/components/molecules/MediaSelector';
import styles from '../CreateNews/CreateNews.module.css';

interface NewsFormData {
  title: string;
  summary: string;
  featuredImageUrl?: string;
  mediaType?: 'image' | 'video';
  mediaSource?: 'external_url' | 'uploaded';
  priority: number;
  categoryId?: string;
  tagIds: string[];
  page?: string;
  isFeaturedHome?: boolean;
  isFeaturedPage?: boolean;
  contentJson?: string;
  [key: string]: unknown;
}

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

const EditNews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewsFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const editorRef = useRef<EditorJS | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Carregar notícia e dados
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [newsRes, categoriesRes, tagsRes] = await Promise.all([
          newsService.getById(id),
          categoryService.getAll(),
          tagService.getAll(),
        ]);

        const newsData = newsRes.data as NewsFormData;
        setFormData(newsData);
        setCategories(categoriesRes.data);
        setAllTags(tagsRes.data);

        // Se a notícia já tem tags, carregar elas
        if (newsData.tagIds && Array.isArray(newsData.tagIds)) {
          const newsTags = tagsRes.data.filter((tag: Tag) =>
            newsData.tagIds.includes(tag.id)
          );
          setSelectedTags(newsTags);
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar dados da notícia.' });
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Inicializar Editor.js
  useEffect(() => {
    if (!loading && formData && !editorRef.current) {
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
                    return { success: 1, file: { url: result.url } };
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    return { success: 0 };
                  }
                },
                async uploadByUrl(url: string) {
                  return {
                    success: 1,
                    file: {
                      url: url,
                    },
                  };
                },
              },
            },
          },
          embed: Embed,
          quote: Quote,
          table: Table,
          code: CodeTool,
        },
        data: formData.contentJson ? (JSON.parse(formData.contentJson) as OutputData) : { blocks: [] },
        placeholder: 'Edite sua notícia aqui...',
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [loading, formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'priority' ? parseInt(value, 10) : value,
          }
        : null
    );
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: checked,
          }
        : null
    );
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
    const existing = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());

    if (existing) {
      if (!selectedTags.find(t => t.id === existing.id)) {
        const newSelectedTags = [...selectedTags, existing];
        setSelectedTags(newSelectedTags);
        setFormData(prev => prev ? { ...prev, tagIds: newSelectedTags.map(t => t.id) } : null);
      }
    } else {
      try {
        const response = await tagService.create({ name: tagName });
        const newTag = response.data as Tag;
        setAllTags([...allTags, newTag]);
        const newSelectedTags = [...selectedTags, newTag];
        setSelectedTags(newSelectedTags);
        setFormData(prev => prev ? { ...prev, tagIds: newSelectedTags.map(t => t.id) } : null);
      } catch (error) {
        console.error('Erro ao criar tag:', error);
      }
    }

    setTagInput('');
    setTagSuggestions([]);
  };

  const removeTag = (tagId: string) => {
    const newSelectedTags = selectedTags.filter(t => t.id !== tagId);
    setSelectedTags(newSelectedTags);
    setFormData(prev => prev ? { ...prev, tagIds: newSelectedTags.map(t => t.id) } : null);
  };

  const selectSuggestion = (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      setFormData(prev => prev ? { ...prev, tagIds: newSelectedTags.map(t => t.id) } : null);
    }
    setTagInput('');
    setTagSuggestions([]);
    tagInputRef.current?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, isDraft = false) => {
    e.preventDefault();
    if (!editorRef.current || !id || !formData) {
      setMessage({ type: 'error', text: 'Editor não inicializado.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const outputData = await editorRef.current.save();

      if (outputData.blocks.length === 0) {
        setMessage({ type: 'error', text: 'O conteúdo da notícia não pode estar vazio.' });
        setSaving(false);
        return;
      }

      const updatedNewsData = {
        ...formData,
        content: JSON.stringify(outputData),
        contentJson: JSON.stringify(outputData),
        status: isDraft ? 'DRAFT' : 'PENDING_REVIEW',
        categoryId: formData.categoryId || null,
        tagIds: selectedTags.map(t => t.id),
      };

      await newsService.update(id, updatedNewsData);
      setMessage({
        type: 'success',
        text: isDraft ? 'Rascunho atualizado com sucesso!' : 'Notícia atualizada com sucesso!'
      });
      setTimeout(() => navigate('/noticias/gerenciar'), 2000);
    } catch (error: unknown) {
      let errorMessage = 'Erro ao atualizar notícia. Tente novamente.';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro ao atualizar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDraft = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e, true);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }} />
          Carregando notícia...
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className={styles.container}>
        <div className={`${styles.message} ${styles.error}`}>
          <i className="fas fa-exclamation-circle" />
          {message.text || 'Não foi possível carregar a notícia.'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Editar Notícia</button>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => setShowPreview(true)}
            disabled={saving}
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
                  value={formData.categoryId || ''}
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
                disabled={saving}
              >
                <i className="fas fa-save" /> Salvar Rascunho
              </button>
              <button
                type="submit"
                className={`${styles.actionButton} ${styles.primary}`}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check" /> Atualizar
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={styles.rightColumn}>
            {/* Mídia Principal */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Mídia Principal (Thumbnail/Cover)</div>
              <div className={styles.formGroup}>
                <MediaSelector
                  value={formData.featuredImageUrl || ''}
                  mediaType={formData.mediaType || 'image'}
                  mediaSource={formData.mediaSource}
                  onChange={(url, mediaType, mediaSource) => {
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            featuredImageUrl: url,
                            mediaType,
                            mediaSource,
                          }
                        : null
                    );
                  }}
                  required
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
                    checked={formData.isFeaturedHome || false}
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
                    checked={formData.isFeaturedPage || false}
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

export default EditNews;
