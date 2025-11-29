import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { newsService } from '@/services/api';
import styles from './Busca.module.css';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  featuredImageUrl?: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  createdAt: string;
  slug: string;
}

const Busca: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Temporariamente usando getAll() até o endpoint de busca estar disponível
        // TODO: Trocar para newsService.search(query) quando o backend estiver pronto
        const response = await newsService.getAll();
        
        // Filtrar localmente enquanto o backend não tem o endpoint
        const filtered = (response.data || []).filter((news: NewsItem) => {
          const searchLower = query.toLowerCase();
          return (
            news.title.toLowerCase().includes(searchLower) ||
            news.summary.toLowerCase().includes(searchLower) ||
            news.category?.name.toLowerCase().includes(searchLower)
          );
        });
        
        setResults(filtered);
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
        setError('Erro ao realizar a busca. Tente novamente.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {query ? (
            <>
              Resultados para: <span className={styles.query}>"{query}"</span>
            </>
          ) : (
            'Busca'
          )}
        </h1>
        {!loading && results.length > 0 && (
          <p className={styles.resultCount}>
            {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        )}
      </div>

      {loading && (
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin" />
          <p>Buscando...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <i className="fas fa-exclamation-circle" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && query && results.length === 0 && (
        <div className={styles.noResults}>
          <i className="fas fa-search" />
          <h2>Nenhum resultado encontrado</h2>
          <p>Tente usar palavras-chave diferentes ou verifique a ortografia.</p>
        </div>
      )}

      {!loading && !query && (
        <div className={styles.noResults}>
          <i className="fas fa-search" />
          <h2>Digite algo para buscar</h2>
          <p>Use a barra de pesquisa acima para encontrar notícias.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className={styles.results}>
          {results.map((news) => (
            <article key={news.id} className={styles.newsCard}>
              {news.featuredImageUrl && (
                <Link to={`/noticia/${news.slug}`} className={styles.imageContainer}>
                  <img
                    src={news.featuredImageUrl}
                    alt={news.title}
                    className={styles.image}
                    loading="lazy"
                  />
                </Link>
              )}
              <div className={styles.content}>
                {news.category && (
                  <Link
                    to={`/categoria/${news.category.slug}`}
                    className={styles.category}
                  >
                    {news.category.name}
                  </Link>
                )}
                <Link to={`/noticia/${news.slug}`}>
                  <h2 className={styles.newsTitle}>{news.title}</h2>
                </Link>
                <p className={styles.summary}>{news.summary}</p>
                <div className={styles.meta}>
                  {news.author && (
                    <span className={styles.author}>
                      <i className="fas fa-user" /> {news.author.name}
                    </span>
                  )}
                  <span className={styles.date}>
                    <i className="fas fa-calendar" /> {formatDate(news.createdAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Busca;
