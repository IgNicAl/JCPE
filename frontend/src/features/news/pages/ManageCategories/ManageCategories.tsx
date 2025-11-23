import React, { useState, useEffect } from 'react';
import { categoryService } from '@/services/api';
import { Category } from '@/types';
import styles from './ManageCategories.module.css';

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar categorias.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira o nome da categoria.' });
      return;
    }

    setIsCreating(true);
    setMessage({ type: '', text: '' });

    try {
      const categoryData: any = {
        name: newCategoryName.trim(),
      };

      // Se uma categoria pai foi selecionada, adicionar ao payload
      if (selectedParentId) {
        categoryData.parentCategoryId = selectedParentId;
      }

      await categoryService.create(categoryData);
      setMessage({
        type: 'success',
        text: selectedParentId
          ? 'Subcategoria criada com sucesso!'
          : 'Categoria criada com sucesso!'
      });
      setNewCategoryName('');
      setSelectedParentId('');
      fetchCategories();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao criar categoria.';
      setMessage({ type: 'error', text: errorMsg });
      console.error('Erro ao criar categoria:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Separar categorias raiz das subcategorias (definir antes de usar em handleDeleteCategory)
  const rootCategories = categories.filter(cat => !cat.parentCategory && !cat.parentCategoryId);
  const getSubcategories = (parentId: string) =>
    categories.filter(cat => cat.parentCategoryId === parentId || cat.parentCategory?.id === parentId);

  const handleDeleteCategory = async (id: string) => {
    console.log('handleDeleteCategory chamado com ID:', id);
    console.log('Tipo do ID:', typeof id);

    // Verificar se a categoria tem subcategorias
    const subcats = getSubcategories(id);
    console.log('Subcategorias encontradas:', subcats);

    if (subcats.length > 0) {
      setMessage({
        type: 'error',
        text: 'Esta categoria possui subcategorias. Exclua-as primeiro.',
      });
      return;
    }

    // Mostrar modal de confirmação
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setMessage({ type: '', text: '' });
    const id = categoryToDelete;
    setCategoryToDelete(null);

    try {
      console.log('Chamando categoryService.delete com ID:', id);
      const response = await categoryService.delete(id);
      console.log('Resposta da exclusão:', response);
      setMessage({ type: 'success', text: 'Categoria excluída com sucesso!' });
      await fetchCategories();
    } catch (error: any) {
      console.error('Erro completo ao excluir:', error);
      console.error('Resposta do erro:', error.response);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao excluir categoria.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <i className="fas fa-folder-open" /> Gerenciar Categorias
        </h1>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          {message.text}
        </div>
      )}

      <div className={styles.createSection}>
        <h2>Criar Nova Categoria ou Subcategoria</h2>
        <form onSubmit={handleCreateCategory} className={styles.createForm}>
          <div className={styles.formRow}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da categoria"
              className={styles.input}
              disabled={isCreating}
            />
            <select
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className={styles.select}
              disabled={isCreating}
              aria-label="Selecionar categoria pai"
            >
              <option value="">Categoria Raiz (sem pai)</option>
              {rootCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  Subcategoria de: {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={styles.btnCreate}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Criando...
              </>
            ) : (
              <>
                <i className="fas fa-plus" /> {selectedParentId ? 'Criar Subcategoria' : 'Criar Categoria'}
              </>
            )}
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h2>Categorias Existentes ({categories.length})</h2>
        {loading ? (
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin" /> Carregando...
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.empty}>
            <i className="fas fa-folder-open" />
            <p>Nenhuma categoria criada ainda.</p>
          </div>
        ) : (
          <div className={styles.categoriesList}>
            {rootCategories.map(category => {
              const subcategories = getSubcategories(category.id);
              return (
                <div key={category.id} className={styles.categoryGroup}>
                  <div className={styles.categoryCard}>
                    <div className={styles.categoryInfo}>
                      <i className="fas fa-folder" />
                      <span className={styles.categoryName}>{category.name}</span>
                      {subcategories.length > 0 && (
                        <span className={styles.subcategoryCount}>
                          {subcategories.length} subcategoria{subcategories.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className={styles.btnDelete}
                      title="Excluir categoria"
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>

                  {subcategories.length > 0 && (
                    <div className={styles.subcategoriesList}>
                      {subcategories.map(subcategory => (
                        <div key={subcategory.id} className={styles.subcategoryCard}>
                          <div className={styles.categoryInfo}>
                            <i className="fas fa-folder-open" />
                            <span className={styles.categoryName}>{subcategory.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(subcategory.id)}
                            className={styles.btnDelete}
                            title="Excluir subcategoria"
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {categoryToDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir esta categoria?</p>
            <div className={styles.modalActions}>
              <button onClick={cancelDelete} className={styles.btnCancel}>
                Cancelar
              </button>
              <button onClick={confirmDelete} className={styles.btnConfirm}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
