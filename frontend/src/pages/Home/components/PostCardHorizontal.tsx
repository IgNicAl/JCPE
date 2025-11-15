import React from 'react';
import { PostPreview } from './PostCardVertical';

type PostCardHorizontalProps = {
  post: PostPreview;
};

const PostCardHorizontal: React.FC<PostCardHorizontalProps> = ({ post }) => (
  <article className="flex flex-col gap-4 rounded-lg bg-white p-2 shadow-card transition hover:-translate-y-1 sm:flex-row">
    <div className="h-40 w-full overflow-hidden rounded-lg sm:w-52">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <h3 className="mb-2 line-clamp-1 font-roboto text-base font-medium capitalize text-dark">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm capitalize text-dark-75">
          {post.summary}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-gray px-4 py-3">
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

export default PostCardHorizontal;

