import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '@/services/api';
import { Category } from '@/types';

interface UseCategoriesReturn {
  categories: Category[];
  rootCategories: Category[];
  loading: boolean;
  error: string | null;
  getSubcategories: (parentId: string) => Category[];
  fetchCategories: () => Promise<void>;
}

/**
 * Hook para gerenciamento de categorias
 * Busca categorias do backend e organiza por raiz e subcategorias
 */
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getAll();
      const receivedCategories = Array.isArray(response?.data) ? response.data : [];
      setCategories(receivedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar categorias ao montar o componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filtrar categorias raiz (sem pai)
  const rootCategories = categories.filter(cat => !cat.parentCategory && !cat.parentCategoryId);

  // Função para obter subcategorias de uma categoria pai
  const getSubcategories = useCallback((parentId: string): Category[] => {
    return categories.filter(cat =>
      cat.parentCategoryId === parentId || cat.parentCategory?.id === parentId
    );
  }, [categories]);

  return {
    categories,
    rootCategories,
    loading,
    error,
    getSubcategories,
    fetchCategories,
  };
};
