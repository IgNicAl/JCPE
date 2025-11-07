import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { newsService } from '@/services/api';
import Output from 'editorjs-react-renderer';
import './NewsPage.css';

function NewsPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getBySlug(slug); // Supondo que você crie esse método no api.js
        setNews(response.data);
      } catch (err) {
        setError('Notícia não encontrada.');
        console.error('Erro ao buscar notícia:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (loading) {
    return <div className="news-page-container">Carregando...</div>;
  }

  if (error) {
    return <div className="news-page-container">{error}</div>;
  }

  return (
    <div className="news-page-container">
      <article className="news-article">
        <h1>{news.title}</h1>
        <p className="news-summary">{news.summary}</p>
        <div className="news-meta">
          <span>Por {news.author.name}</span>
          <span>{new Date(news.publicationDate).toLocaleDateString('pt-BR')}</span>
        </div>
        <img src={news.featuredImageUrl} alt={news.title} className="featured-image" />
        <div className="news-content">
          {news.contentJson ? (
            <Output data={JSON.parse(news.contentJson)} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
          )}
        </div>
      </article>
    </div>
  );
}

export default NewsPage;
