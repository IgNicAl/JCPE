import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/services/api';
import { News } from '@/types';

interface UseNewsOptions {
  autoFetch?: boolean;
  initialData?: News[];
  page?: string;
  featuredHome?: boolean;
  featuredPage?: boolean;
}

interface UseNewsReturn {
  news: News[];
  loading: boolean;
  error: string | null;
  fetchNews: () => Promise<News[]>;
  fetchNewsBySlug: (slug: string) => Promise<News | null>;
  createNews: (newsData: unknown) => Promise<News>;
  updateNews: (id: string, newsData: unknown) => Promise<News>;
  deleteNews: (id: string) => Promise<void>;
  setNews: React.Dispatch<React.SetStateAction<News[]>>;
}

/**
 * Hook para gerenciamento de notícias
 */
export const useNews = (options: UseNewsOptions = {}): UseNewsReturn => {
  const { autoFetch = true, initialData = [], page, featuredHome, featuredPage } = options;

  const [news, setNews] = useState<News[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (): Promise<News[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.getAll(page, featuredHome, featuredPage);
      const receivedNews = Array.isArray(response?.data) ? response.data : [];

      // Ordenar por prioridade e data
      receivedNews.sort(
        (a: News, b: News) =>
          ((b as News & { priority?: number }).priority || 0) - ((a as News & { priority?: number }).priority || 0) ||
          new Date((b as News & { publicationDate: string }).publicationDate || '').getTime() -
          new Date((a as News & { publicationDate: string }).publicationDate || '').getTime()
      );

      // Se não houver notícias e houver initialData, manter initialData
      if (receivedNews.length === 0 && initialData.length > 0) {
        setNews(initialData);
      } else {
        setNews(receivedNews.length > 0 ? receivedNews : initialData);
      }
      return receivedNews.length > 0 ? receivedNews : initialData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar notícias';
      // Em caso de erro, usar initialData se disponível
      if (initialData.length > 0) {
        setNews(initialData);
      }
      setError(errorMessage);
      console.error('Erro ao buscar notícias:', err);
      return initialData;
    } finally {
      setLoading(false);
    }
  }, [initialData, page, featuredHome, featuredPage]);

  const fetchNewsBySlug = useCallback(async (slug: string): Promise<News | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.getBySlug(slug);
      return response.data as News;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar notícia';
      setError(errorMessage);
      console.error('Erro ao buscar notícia:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNews = useCallback(async (newsData: unknown): Promise<News> => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.create(newsData);
      return response.data as News;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar notícia';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNews = useCallback(async (id: string, newsData: unknown): Promise<News> => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsService.update(id, newsData);
      return response.data as News;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar notícia';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNews = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await newsService.delete(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar notícia';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchNews();
    }
  }, [autoFetch, fetchNews, page, featuredHome, featuredPage]);

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

