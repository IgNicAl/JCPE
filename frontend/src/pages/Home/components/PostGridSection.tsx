import React from 'react';
import HomeSectionTitle from './HomeSectionTitle';
import ArrowControls from './ArrowControls';
import PostCardVertical, { PostPreview } from './PostCardVertical';

type PostGridSectionProps = {
  title: string;
  posts: PostPreview[];
  disableLeftArrow?: boolean;
};

const PostGridSection: React.FC<PostGridSectionProps> = ({
  title,
  posts,
  disableLeftArrow = false,
}) => (
  <section className="space-y-6">
    <HomeSectionTitle title={title}>
      <ArrowControls disableLeft={disableLeftArrow} />
    </HomeSectionTitle>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCardVertical key={post.id} post={post} />
      ))}
    </div>
  </section>
);

export default PostGridSection;

