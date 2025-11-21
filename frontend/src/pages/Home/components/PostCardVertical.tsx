import React from 'react';
import { useNavigate } from 'react-router-dom';

export type PostPreview = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  publicationDate: string;
  slug?: string;
};

type PostCardVerticalProps = {
  post: PostPreview;
};

const PostCardVertical: React.FC<PostCardVerticalProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('[PostCardVertical] Click detected:', {
      title: post.title,
      slug: post.slug,
      id: post.id
    });
    if (post.slug) {
      console.log('[PostCardVertical] Navigating to:', `/noticia/${post.slug}`);
      navigate(`/noticia/${post.slug}`);
    } else {
      console.warn('[PostCardVertical] No slug available, cannot navigate');
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implementar funcionalidade de salvar/bookmark
    console.log('Bookmark clicked for:', post.title);
  };

  return (
    <article className="flex h-full flex-col rounded-lg bg-white p-2 shadow-card transition hover:-translate-y-1">
      <div
        className="relative h-48 w-full overflow-hidden rounded-lg cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`Ver imagem de: ${post.title}`}
      >
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col px-1 py-4">
        <div
          className="cursor-pointer"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick();
            }
          }}
          aria-label={`Ler notícia: ${post.title}`}
        >
          <h3 className="mb-3 line-clamp-1 font-roboto text-base font-medium capitalize text-dark">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm capitalize text-dark-75">
            {post.summary}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between rounded-lg bg-gray px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="h-11 w-11 rounded-lg object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-medium text-dark">{post.authorName}</p>
              <p className="text-xs text-dark-50">{post.publicationDate}</p>
            </div>
          </div>
          <button
            type="button"
            className="text-lg text-dark-50 transition hover:text-primary"
            aria-label={`Salvar post: ${post.title}`}
            onClick={handleBookmarkClick}
          >
            <i className="far fa-bookmark" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCardVertical;

