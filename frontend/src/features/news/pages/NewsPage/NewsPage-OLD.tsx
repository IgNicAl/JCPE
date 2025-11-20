import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { newsService } from '@/services/api';
import Output from 'editorjs-react-renderer';
import { News } from '@/types';
import './NewsPage.css';

interface NewsWithDetails {
  id?: string;
  title: string;
  summary: string;
  author: {
    name: string;
  };
  publicationDate: string;
  featuredImageUrl: string;
  contentJson?: string;
  content?: string;
}

const NewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchNews = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await newsService.getBySlug(slug);
        setNews(response.data as NewsWithDetails);
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

  if (error || !news) {
    return <div className="news-page-container">{error || 'Notícia não encontrada'}</div>;
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
            <div dangerouslySetInnerHTML={{ __html: news.content || '' }}></div>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsPage;

