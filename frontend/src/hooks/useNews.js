import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/services/api';

/**
 * Hook para gerenciamento de notícias
 */
export const useNews = (options = {}) => {
  const { autoFetch = true, initialData = [] } = options;

  const [news, setNews] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.getAll();
      const receivedNews = Array.isArray(response?.data) ? response.data : [];

      // Ordenar por prioridade e data
      receivedNews.sort(
        (a, b) =>
          (b.priority || 0) - (a.priority || 0) ||
          new Date(b.publicationDate) - new Date(a.publicationDate)
      );

      // Se não houver notícias e houver initialData, manter initialData
      if (receivedNews.length === 0 && initialData.length > 0) {
        setNews(initialData);
      } else {
        setNews(receivedNews.length > 0 ? receivedNews : initialData);
      }
      return receivedNews.length > 0 ? receivedNews : initialData;
    } catch (err) {
      // Em caso de erro, usar initialData se disponível
      if (initialData.length > 0) {
        setNews(initialData);
      }
      setError(err.message || 'Erro ao carregar notícias');
      console.error('Erro ao buscar notícias:', err);
      return initialData;
    } finally {
      setLoading(false);
    }
  }, [initialData]);

  const fetchNewsBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.getBySlug(slug);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao carregar notícia');
      console.error('Erro ao buscar notícia:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNews = useCallback(async (newsData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.create(newsData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao criar notícia');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNews = useCallback(async (id, newsData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.update(id, newsData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao atualizar notícia');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNews = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await newsService.delete(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message || 'Erro ao deletar notícia');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchNews();
    }
  }, [autoFetch, fetchNews]);

  return {
    news,
    loading,
    error,
    fetchNews,
    fetchNewsBySlug,
    createNews,
    updateNews,
    deleteNews,
    setNews,
  };
};

