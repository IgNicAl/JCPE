import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciamento de drafts no localStorage
 */
export const useDraft = <T>(key: string, initialData: T | null = null) => {
  const [draft, setDraft] = useState<T | null>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialData;
    } catch {
      return initialData;
    }
  });

  const saveDraft = useCallback(
    (data: T | ((prev: T | null) => T)) => {
      try {
        const dataToSave = typeof data === 'function' ? (data as (prev: T | null) => T)(draft) : data;
        localStorage.setItem(key, JSON.stringify(dataToSave));
        setDraft(dataToSave);
      } catch (error) {
        console.error('Erro ao salvar draft:', error);
      }
    },
    [key, draft]
  );

  const loadDraft = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        setDraft(parsed);
        return parsed;
      }
      return initialData;
    } catch (error) {
      console.error('Erro ao carregar draft:', error);
      return initialData;
    }
  }, [key, initialData]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setDraft(initialData);
    } catch (error) {
      console.error('Erro ao limpar draft:', error);
    }
  }, [key, initialData]);

  // Auto-save quando draft muda (debounced)
  useEffect(() => {
    if (draft === null || draft === undefined) return;

    const timeoutId = setTimeout(() => {
      saveDraft(draft);
    }, 1000); // Salva após 1 segundo de inatividade

    return () => clearTimeout(timeoutId);
  }, [draft, saveDraft]);

  return {
    draft,
    setDraft,
    saveDraft,
    loadDraft,
    clearDraft,
  };
};

