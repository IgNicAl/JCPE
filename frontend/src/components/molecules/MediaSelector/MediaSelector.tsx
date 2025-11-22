import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { mediaService } from '@/services/api';
import styles from './MediaSelector.module.css';

interface MediaSelectorProps {
  value?: string;
  mediaType?: 'image' | 'video';
  mediaSource?: 'external_url' | 'uploaded';
  onChange: (url: string, mediaType: 'image' | 'video', mediaSource: 'external_url' | 'uploaded') => void;
  required?: boolean;
}

type SelectionMethod = 'url' | 'upload';

const MediaSelector: React.FC<MediaSelectorProps> = ({
  value = '',
  mediaType: initialMediaType = 'image',
  mediaSource: initialMediaSource,
  onChange,
  required = false,
}) => {
  const [method, setMethod] = useState<SelectionMethod>(initialMediaSource === 'uploaded' ? 'upload' : 'url');
  const [urlInput, setUrlInput] = useState(value);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [currentMediaType, setCurrentMediaType] = useState<'image' | 'video'>(initialMediaType);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar URL externa
  const handleUrlChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    setError('');

    if (!url.trim()) {
      setPreviewUrl('');
      return;
    }

    setValidating(true);
    try {
      const response = await mediaService.validateUrl(url);
      const data = response.data;

      if (data.success) {
        setPreviewUrl(url);
        setCurrentMediaType(data.mediaType);
        onChange(url, data.mediaType, 'external_url');
        setError('');
      } else {
        setError(data.message || 'URL inválida');
        setPreviewUrl('');
      }
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'URL inválida ou inacessível'
        : 'URL inválida ou inacessível';
      setError(errorMsg);
      setPreviewUrl('');
    } finally {
      setValidating(false);
    }
  };

  // Upload de arquivo
  const handleFileUpload = async (file: File) => {
    setError('');
    setUploading(true);
    setUploadProgress(0);

    // Validação básica de tipo
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setError('Arquivo não suportado. Use JPG, PNG, GIF, WEBP, MP4, WEBM ou MOV');
      setUploading(false);
      return;
    }

    // Validação de tamanho
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeStr = isVideo ? '100 MB' : '10 MB';
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSizeStr}`);
      setUploading(false);
      return;
    }

    try {
      const response = await mediaService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      const data = response.data;

      if (data.success) {
        const fullUrl = data.url;
        setPreviewUrl(fullUrl);
        setCurrentMediaType(data.mediaType);
        onChange(fullUrl, data.mediaType, 'uploaded');
        setError('');
      } else {
        setError(data.message || 'Erro ao fazer upload');
      }
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao fazer upload'
        : 'Erro ao fazer upload';
      setError(errorMsg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveMedia = () => {
    setPreviewUrl('');
    setUrlInput('');
    setError('');
    onChange('', 'image', 'external_url');
  };

  return (
    <div className={styles.container}>
      <div className={styles.methodSelector}>
        <label className={`${styles.methodOption} ${method === 'url' ? styles.active : ''}`}>
          <input
            type="radio"
            name="method"
            value="url"
            checked={method === 'url'}
            onChange={() => setMethod('url')}
          />
          <i className="fas fa-link" />
          <span>URL Externa</span>
        </label>
        <label className={`${styles.methodOption} ${method === 'upload' ? styles.active : ''}`}>
          <input
            type="radio"
            name="method"
            value="upload"
            checked={method === 'upload'}
            onChange={() => setMethod('upload')}
          />
          <i className="fas fa-upload" />
          <span>Upload de Arquivo</span>
        </label>
      </div>

      {method === 'url' && (
        <div className={styles.urlSection}>
          <input
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="Cole a URL da imagem ou vídeo (YouTube, Vimeo, link direto...)"
            className={styles.urlInput}
            required={required && !previewUrl}
          />
          {validating && (
            <div className={styles.validating}>
              <i className="fas fa-spinner fa-spin" /> Validando URL...
            </div>
          )}
        </div>
      )}

      {method === 'upload' && (
        <div className={styles.uploadSection}>
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${uploading ? styles.uploading : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className={styles.uploadingState}>
                <i className="fas fa-spinner fa-spin" />
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                </div>
                <span>{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt" />
                <p>Arraste e solte ou clique para selecionar</p>
                <span className={styles.formats}>JPG, PNG, GIF, WEBP, MP4, WEBM, MOV</span>
                <span className={styles.limits}>Máx: 10 MB (imagens) | 100 MB (vídeos)</span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov"
            onChange={handleFileInputChange}
            className={styles.fileInput}
            disabled={uploading}
          />
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <i className="fas fa-exclamation-circle" /> {error}
        </div>
      )}

      {previewUrl && !error && (
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <span>
              <i className={`fas ${currentMediaType === 'video' ? 'fa-video' : 'fa-image'}`} />
              Preview {currentMediaType === 'video' ? 'do Vídeo' : 'da Imagem'}
            </span>
            <button type="button" onClick={handleRemoveMedia} className={styles.removeButton}>
              <i className="fas fa-times" /> Remover
            </button>
          </div>
          <div className={styles.previewContent}>
            {currentMediaType === 'video' ? (
              previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be') ? (
                <div className={styles.videoEmbed}>
                  <iframe
                    src={previewUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : previewUrl.includes('vimeo.com') ? (
                <div className={styles.videoEmbed}>
                  <iframe
                    src={previewUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                    title="Vimeo video"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video src={previewUrl} controls className={styles.videoPlayer} />
              )
            ) : (
              <img src={previewUrl} alt="Preview" className={styles.imagePreview} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSelector;
