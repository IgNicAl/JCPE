import React, { useState, useEffect } from 'react';
import { newsService } from '@/services/api';
import { News } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import './Interior.css';

const Interior: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getByCategory('pernambuco/interior');
      setNews(response.data);
    } catch (err) {
      setError('Erro ao carregar notícias');
      console.error('Erro ao buscar notícias:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="interior-page">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin" />
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interior-page">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interior-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/categoria/pernambuco">Pernambuco</Link>
          <span>/</span>
          <span>Interior</span>
        </div>
        <h1>
          <i className="fas fa-map-marked-alt" />
          Interior
        </h1>
        <p className="category-description">
          Notícias das cidades do interior de Pernambuco
        </p>
      </div>

      <div className="news-grid">
        {news.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-newspaper" />
            <h3>Nenhuma notícia encontrada</h3>
            <p>Não há notícias disponíveis nesta categoria no momento.</p>
          </div>
        ) : (
          news.map((item) => (
            <article key={item.id} className="news-card">
              {item.imageUrl && (
                <div className="news-image">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
              )}
              <div className="news-content">
                <h2>
                  <Link to={`/noticia/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="news-excerpt">{item.summary}</p>
                <div className="news-meta">
                  <span className="news-date">
                    <i className="far fa-calendar" />
                    {formatDate(item.publishedAt || item.createdAt || '')}
                  </span>
                  {item.author && (
                    <span className="news-author">
                      <i className="far fa-user" />
                      {typeof item.author === 'object' ? item.author.name : item.author}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Interior;
