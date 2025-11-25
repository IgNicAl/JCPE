import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsReviewService, categoryService } from '@/services/api';
import { News, Category } from '@/types';
import { formatDate } from '@/utils/formatters';
import './ReviewDashboard.css';

const ReviewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [activeTab, selectedParentCategory, selectedSubcategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'pending'
        ? await newsReviewService.getPendingReviews()
        : await newsReviewService.getReviewedNews();

      let filteredNews = response.data;

      // Filtrar por categoria/subcategoria
      if (selectedSubcategory !== 'all') {
        // Se subcategoria específica selecionada, mostrar apenas dessa subcategoria
        filteredNews = filteredNews.filter((news: News) =>
          news.category?.id === selectedSubcategory
        );
      } else if (selectedParentCategory !== 'all') {
        // Se apenas categoria pai selecionada, mostrar todas as notícias dessa categoria e suas subcategorias
        filteredNews = filteredNews.filter((news: News) => {
          if (!news.category) return false;
          // Verificar se a categoria da notícia é a categoria pai selecionada
          if (news.category.id === selectedParentCategory) return true;
          // Ou se a categoria da notícia tem como pai a categoria selecionada
          if (news.category.parentCategoryId === selectedParentCategory ||
              news.category.parentCategory?.id === selectedParentCategory) return true;
          return false;
        });
      }

      setNewsList(filteredNews);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (newsId: string) => {
    // Redirecionar para a página de revisão detalhada (a ser criada)
    // Por enquanto, vamos redirecionar para edição, mas idealmente seria uma tela específica
    navigate(`/painel/revisao/${newsId}`);
  };

  const handleManageCategories = () => {
    navigate('/painel/categorias');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING_REVIEW: 'Aguardando Revisão',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      PUBLISHED: 'Publicado',
      DRAFT: 'Rascunho'
    };
    return labels[status] || status;
  };

  // Função auxiliar para obter o nome completo da categoria (incluindo pai)
  const getFullCategoryName = (category: Category | undefined) => {
    if (!category) return '';

    // Se tem categoria pai, mostrar "Pai > Filho"
    if (category.parentCategory) {
      return `${category.parentCategory.name} > ${category.name}`;
    }
    // Se tem parentCategoryId, buscar o pai nas categorias
    if (category.parentCategoryId) {
      const parent = categories.find(cat => cat.id === category.parentCategoryId);
      if (parent) {
        return `${parent.name} > ${category.name}`;
      }
    }
    // Se não tem pai, é categoria principal
    return category.name;
  };

  // Obter categorias pai (sem parent)
  const parentCategories = categories.filter(cat => !cat.parentCategory && !cat.parentCategoryId);

  // Obter subcategorias filtradas pela categoria pai selecionada
  const getSubcategories = () => {
    if (selectedParentCategory === 'all') {
      // Mostrar todas as subcategorias
      return categories.filter(cat => cat.parentCategory || cat.parentCategoryId);
    }
    // Mostrar apenas subcategorias da categoria pai selecionada
    return categories.filter(cat =>
      cat.parentCategoryId === selectedParentCategory ||
      cat.parentCategory?.id === selectedParentCategory
    );
  };

  return (
    <div className="review-dashboard-container">
      <div className="review-dashboard-header">
        <h1>
          <i className="fas fa-clipboard-check" />
          Painel de Revisão
        </h1>
        <button
          className="btn-manage-categories"
          onClick={handleManageCategories}
        >
          <i className="fas fa-folder-plus" /> Gerenciar Categorias
        </button>
      </div>

      <div className="review-filters">
        <div className="review-tabs">
          <button
            className={`review-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pendentes
          </button>
          <button
            className={`review-tab ${activeTab === 'reviewed' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviewed')}
          >
            Histórico
          </button>
        </div>

        <div className="category-filter">
          <label htmlFor="parent-category-select">
            <i className="fas fa-filter" /> Filtrar por Categoria:
          </label>
          <select
            id="parent-category-select"
            value={selectedParentCategory}
            onChange={(e) => {
              setSelectedParentCategory(e.target.value);
              // Resetar subcategoria quando mudar categoria pai
              setSelectedSubcategory('all');
            }}
            className="category-select"
          >
            <option value="all">Todas as Categorias</option>
            {parentCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="category-filter">
          <label htmlFor="subcategory-select">
            <i className="fas fa-filter" /> Filtrar por Subcategoria:
          </label>
          <select
            id="subcategory-select"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="category-select"
          >
            <option value="all">Todas as Subcategorias</option>
            {getSubcategories().map(subcat => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin" /> Carregando...
        </div>
      ) : newsList.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-check-circle" />
          <h3>Tudo limpo!</h3>
          <p>Não há notícias {activeTab === 'pending' ? 'pendentes de revisão' : 'no histórico'}.</p>
        </div>
      ) : (
        <div className="review-list">
          {newsList.map((news) => (
            <div key={news.id} className="review-card">
              <div className="review-card-content">
                <h3 className="review-card-title">{news.title}</h3>
                <div className="review-card-meta">
                  <span>
                    <i className="fas fa-user" />
                    {typeof news.author === 'object' ? news.author?.name : 'Autor desconhecido'}
                  </span>
                  <span>
                    <i className="fas fa-calendar" />
                    {formatDate(news.createdAt || '')}
                  </span>
                  {news.category && (
                    <span>
                      <i className="fas fa-folder" />
                      {getFullCategoryName(news.category)}
                    </span>
                  )}
                </div>

                {/* Exibir tags se existirem */}
                {news.tags && news.tags.length > 0 && (
                  <div className="review-card-tags">
                    {news.tags.map(tag => (
                      <span key={tag.id} className="review-tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <span className={`review-card-status status-${news.status?.toString().toLowerCase()}`}>
                  {getStatusLabel(news.status as string)}
                </span>
              </div>
              <div className="review-card-actions">
                <button
                  className="btn-review btn-primary"
                  onClick={() => handleReviewClick(news.id!)}
                >
                  <i className="fas fa-eye" />
                  {activeTab === 'pending' ? 'Revisar' : 'Ver Detalhes'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDashboard;
