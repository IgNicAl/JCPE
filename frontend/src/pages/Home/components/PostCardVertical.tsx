import React from 'react';

export type PostPreview = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  publicationDate: string;
};

type PostCardVerticalProps = {
  post: PostPreview;
};

const PostCardVertical: React.FC<PostCardVerticalProps> = ({ post }) => (
  <article className="flex h-full flex-col rounded-lg bg-white p-2 shadow-card transition hover:-translate-y-1">
    <div className="relative h-48 w-full overflow-hidden rounded-lg">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="flex flex-1 flex-col px-1 py-4">
      <h3 className="mb-3 line-clamp-1 font-roboto text-base font-medium capitalize text-dark">
        {post.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm capitalize text-dark-75">
        {post.summary}
      </p>
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
          aria-label="Salvar post"
        >
          <i className="far fa-bookmark" />
        </button>
      </div>
    </div>
  </article>
);

export default PostCardVertical;

