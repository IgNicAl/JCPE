import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adsService } from '@/services/api';
import styles from './CreateEditAd.module.css';

interface AdFormData {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'sidebar-top' | 'sidebar-bottom' | '';
  active: boolean;
}

const INITIAL_FORM: AdFormData = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  position: '',
  active: true,
};

const CreateEditAd: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<AdFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      loadAd();
    }
  }, [id]);

  const loadAd = async () => {
    try {
      setLoading(true);
      const response = await adsService.getById(id!);
      const ad = response.data;
      setFormData({
        title: ad.title,
        imageUrl: ad.imageUrl,
        linkUrl: ad.linkUrl,
        position: ad.position,
        active: ad.active,
      });
    } catch (error) {
      console.error('Erro ao carregar anúncio:', error);
      showMessage('error', 'Erro ao carregar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.position) {
      showMessage('error', 'Por favor, selecione uma posição na sidebar');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        await adsService.update(id!, formData);
        showMessage('success', 'Anúncio atualizado com sucesso!');
      } else {
        await adsService.create(formData);
        showMessage('success', 'Anúncio criado com sucesso!');
      }
      
      setTimeout(() => {
        navigate('/painel/anuncios');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error);
      showMessage('error', 'Erro ao salvar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/painel/anuncios');
  };

  if (loading && isEditing) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando anúncio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>
          <i className="fas fa-arrow-left" />
          Voltar
        </button>
        <div>
          <h1 className={styles.title}>
            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus-circle'}`} />
            {isEditing ? 'Editar Anúncio' : 'Criar Novo Anúncio'}
          </h1>
          <p className={styles.subtitle}>
            {isEditing 
              ? 'Atualize as informações do anúncio abaixo' 
              : 'Preencha os dados para criar um novo anúncio'}
          </p>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className="fas fa-info-circle" />
            Informações Básicas
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <i className="fas fa-tag" /> Título do Anúncio *
            </label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Anúncio Patrocinador"
              required
              disabled={loading}
            />
            <small className={styles.fieldHelper}>
              Nome identificador do anúncio (não será exibido publicamente)
            </small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <i className="fas fa-map-marker-alt" /> Posição na Sidebar *
            </label>
            <div className={styles.positionOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="position"
                  value="sidebar-top"
                  checked={formData.position === 'sidebar-top'}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as 'sidebar-top' | 'sidebar-bottom' })}
                  required
                  disabled={loading}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioHeader}>
                    <i className="fas fa-arrow-up" />
                    <strong>Topo da Sidebar</strong>
                  </div>
                  <p>O anúncio aparecerá na parte superior da barra lateral direita</p>
                </div>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="position"
                  value="sidebar-bottom"
                  checked={formData.position === 'sidebar-bottom'}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as 'sidebar-top' | 'sidebar-bottom' })}
                  required
                  disabled={loading}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioHeader}>
                    <i className="fas fa-arrow-down" />
                    <strong>Rodapé da Sidebar</strong>
                  </div>
                  <p>O anúncio aparecerá na parte inferior da barra lateral direita</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className="fas fa-image" />
            Imagem do Anúncio
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              URL da Imagem *
            </label>
            <input
              type="url"
              className={styles.input}
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
              required
              disabled={loading}
            />
            <small className={styles.fieldHelper}>
              <i className="fas fa-info-circle" />
              Dimensões recomendadas: 350px × 180px para melhor visualização
            </small>
          </div>

          {formData.imageUrl && (
            <div className={styles.imagePreview}>
              <p className={styles.previewLabel}>Preview da Imagem:</p>
              <div className={styles.previewContainer}>
                <img src={formData.imageUrl} alt="Preview" />
              </div>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className="fas fa-link" />
            Link de Destino
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              URL de Destino *
            </label>
            <input
              type="url"
              className={styles.input}
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://exemplo.com/landing-page"
              required
              disabled={loading}
            />
            <small className={styles.fieldHelper}>
              <i className="fas fa-external-link-alt" />
              Link para onde o usuário será redirecionado ao clicar no anúncio
            </small>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className="fas fa-cog" />
            Configurações
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                disabled={loading}
              />
              <div className={styles.toggleContent}>
                <i className={`fas ${formData.active ? 'fa-check-circle' : 'fa-circle'}`} />
                <div>
                  <strong>Anúncio Ativo</strong>
                  <p>
                    {formData.active 
                      ? 'O anúncio está visível para os usuários' 
                      : 'O anúncio está oculto e não será exibido'}
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.btnSecondary} 
            onClick={handleCancel}
            disabled={loading}
          >
            <i className="fas fa-times" />
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-save'}`} />
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Anúncio' : 'Criar Anúncio')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditAd;
