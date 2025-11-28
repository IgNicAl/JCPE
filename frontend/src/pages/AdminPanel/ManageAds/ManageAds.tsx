import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Advertisement } from '@/types/advertisement';
import { advertisementService } from '@/services/advertisementService';
import './ManageAds.css';

const ManageAds: React.FC = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    width: 350,
    height: 180,
    location: 'id' as 'id' | 'class',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await advertisementService.getAll();
      setAds(data);
    } catch (error) {
      console.error('Error loading ads:', error);
      alert('Erro ao carregar anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingAd) {
        await advertisementService.update(editingAd.id!, formData);
        alert('Anúncio atualizado com sucesso!');
      } else {
        await advertisementService.create(formData);
        alert('Anúncio criado com sucesso!');
      }
      
      resetForm();
      loadAds();
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Erro ao salvar anúncio');
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      width: ad.width,
      height: ad.height,
      location: ad.location,
      isActive: ad.isActive,
      startDate: ad.startDate || '',
      endDate: ad.endDate || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }

    try {
      await advertisementService.delete(id);
      alert('Anúncio excluído com sucesso!');
      loadAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Erro ao excluir anúncio');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      linkUrl: '',
      width: 350,
      height: 180,
      location: 'id',
      isActive: true,
      startDate: '',
      endDate: '',
    });
    setEditingAd(null);
    setShowForm(false);
  };

  const getLocationLabel = (location: 'id' | 'class') => {
    return location === 'id' ? 'ID (sidebar-widget ad-widget)' : 'Classe (sidebar-widget ad-widget)';
  };

  return (
    <div className="manage-ads-page">
      <div className="manage-ads-container">
        <div className="page-header">
          <div>
            <h1>
              <i className="fas fa-ad"></i>
              Gerenciar Anúncios
            </h1>
            <p>Crie e gerencie anúncios do portal (aparecem apenas em páginas de notícias)</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-back"
              onClick={() => navigate('/painel')}
            >
              <i className="fas fa-arrow-left"></i>
              Voltar ao Painel
            </button>
            {!showForm && (
              <button 
                className="btn-create"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus"></i>
                Novo Anúncio
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="ad-form-section">
            <div className="form-header">
              <h2>{editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ad-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Título do Anúncio *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nome identificador do anúncio"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="linkUrl">URL de Destino</label>
                  <input
                    type="url"
                    id="linkUrl"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">URL da Imagem *</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="width">Largura (px)</label>
                  <input
                    type="number"
                    id="width"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    min="100"
                    max="1000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">Altura (px)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    min="100"
                    max="1000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Localização do Anúncio *</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="id">ID: sidebar-widget ad-widget</option>
                    <option value="class">Classe: sidebar-widget ad-widget</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Data de Início</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Data de Término</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Anúncio ativo</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <i className="fas fa-save"></i>
                  {editingAd ? 'Atualizar' : 'Criar'} Anúncio
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="ads-list-section">
          <h2>Anúncios Cadastrados</h2>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : ads.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-ad"></i>
              <p>Nenhum anúncio cadastrado</p>
              <button className="btn-create" onClick={() => setShowForm(true)}>
                Criar Primeiro Anúncio
              </button>
            </div>
          ) : (
            <div className="ads-grid">
              {ads.map((ad) => (
                <div key={ad.id} className={`ad-card ${!ad.isActive ? 'inactive' : ''}`}>
                  <div className="ad-card-image">
                    <img src={ad.imageUrl} alt={ad.title} />
                    {!ad.isActive && <div className="inactive-badge">Inativo</div>}
                  </div>
                  <div className="ad-card-content">
                    <h3>{ad.title}</h3>
                    <div className="ad-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{getLocationLabel(ad.location)}</span>
                    </div>
                    <div className="ad-stats">
                      <span>
                        <i className="fas fa-mouse-pointer"></i>
                        {ad.clickCount || 0} cliques
                      </span>
                      <span>
                        <i className="fas fa-eye"></i>
                        {ad.impressionCount || 0} impressões
                      </span>
                    </div>
                    <div className="ad-card-actions">
                      <button className="btn-edit" onClick={() => handleEdit(ad)}>
                        <i className="fas fa-edit"></i>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(ad.id!)}>
                        <i className="fas fa-trash"></i>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAds;
