import React, { useState, ChangeEvent, FormEvent } from 'react';
import { HomepageSection } from '@/types';
import styles from './PublishModal.module.css';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: PublishData) => void;
  homepageSections: HomepageSection[];
  loading?: boolean;
}

export interface PublishData {
  homepageSectionIds: string[];
  seoTitle?: string;
  seoMetaDescription?: string;
  comments?: string;
}

const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  homepageSections,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PublishData>({
    homepageSectionIds: [],
    seoTitle: '',
    seoMetaDescription: '',
    comments: '',
  });

  const handleSectionToggle = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      homepageSectionIds: prev.homepageSectionIds.includes(sectionId)
        ? prev.homepageSectionIds.filter(id => id !== sectionId)
        : [...prev.homepageSectionIds, sectionId],
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} type="button">
          ×
        </button>

        <h2 className={styles.modalTitle}>
          <i className="fas fa-paper-plane" />
          Publicar Notícia
        </h2>

        <p className={styles.modalDescription}>
          Confirme as configurações finais antes de publicar a notícia.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Seções da Homepage */}
          <div className={styles.formSection}>
            <label className={styles.sectionLabel}>
              <i className="fas fa-home" />
              Containers da Home (opcional)
            </label>
            <p className={styles.sectionHelp}>
              Selecione em quais seções da página inicial esta notícia deve aparecer
            </p>
            <div className={styles.checkboxGroup}>
              {homepageSections.map(section => (
                <label key={section.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.homepageSectionIds.includes(section.id)}
                    onChange={() => handleSectionToggle(section.id)}
                    className={styles.checkbox}
                  />
                  <span>{section.name}</span>
                  {section.description && (
                    <span className={styles.sectionDescription}>
                      {section.description}
                    </span>
                  )}
                </label>
              ))}
              {homepageSections.length === 0 && (
                <p className={styles.emptyState}>Nenhuma seção disponível</p>
              )}
            </div>
          </div>

          {/* SEO Title */}
          <div className={styles.formSection}>
            <label className={styles.inputLabel} htmlFor="seoTitle">
              <i className="fas fa-search" />
              Título SEO (opcional)
            </label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="Título otimizado para motores de busca"
              className={styles.input}
              maxLength={60}
            />
            <span className={styles.charCount}>
              {formData.seoTitle?.length || 0}/60 caracteres
            </span>
          </div>

          {/* SEO Meta Description */}
          <div className={styles.formSection}>
            <label className={styles.inputLabel} htmlFor="seoMetaDescription">
              <i className="fas fa-align-left" />
              Meta Descrição SEO (opcional)
            </label>
            <textarea
              id="seoMetaDescription"
              name="seoMetaDescription"
              value={formData.seoMetaDescription}
              onChange={handleChange}
              placeholder="Breve descrição para resultados de busca"
              className={styles.textarea}
              rows={3}
              maxLength={160}
            />
            <span className={styles.charCount}>
              {formData.seoMetaDescription?.length || 0}/160 caracteres
            </span>
          </div>

          {/* Comentários */}
          <div className={styles.formSection}>
            <label className={styles.inputLabel} htmlFor="comments">
              <i className="fas fa-comment" />
              Comentários (opcional)
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Adicione observações sobre a publicação..."
              className={styles.textarea}
              rows={2}
            />
          </div>

          {/* Botões de ação */}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <i className="fas fa-check" />
                  Confirmar Publicação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishModal;
