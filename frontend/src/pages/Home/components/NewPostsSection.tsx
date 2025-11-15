import React from 'react';
import HomeSectionTitle from './HomeSectionTitle';
import PostCardHorizontal from './PostCardHorizontal';
import { PostPreview } from './PostCardVertical';

type NewPostsSectionProps = {
  posts: PostPreview[];
  onShowAll?: () => void;
};

const NewPostsSection: React.FC<NewPostsSectionProps> = ({ posts, onShowAll }) => {
  const handleShowAll = () => {
    if (onShowAll) {
      onShowAll();
    }
  };

  return (
    <section className="space-y-6">
      <HomeSectionTitle title="new posts">
        <button
          type="button"
          onClick={handleShowAll}
          className="flex items-center gap-2 rounded-lg bg-gray px-6 py-2 text-sm font-medium capitalize text-dark-75 transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Show all
          <i className="fas fa-chevron-right text-base" />
        </button>
      </HomeSectionTitle>
      <div className="grid gap-6 xl:grid-cols-2">
        {posts.map((post) => (
          <PostCardHorizontal key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default NewPostsSection;

