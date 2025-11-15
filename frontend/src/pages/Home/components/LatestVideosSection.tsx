import React from 'react';
import HomeSectionTitle from './HomeSectionTitle';
import ArrowControls from './ArrowControls';

type VideoPost = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

type LatestVideosSectionProps = {
  highlight: VideoPost;
  posts: VideoPost[];
};

const LatestVideosSection: React.FC<LatestVideosSectionProps> = ({ highlight, posts }) => (
  <section className="space-y-6">
    <HomeSectionTitle title="latest videos">
      <ArrowControls disableLeft />
    </HomeSectionTitle>
    <div className="rounded-2xl bg-gray/70 p-4">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="relative overflow-hidden rounded-2xl">
          <img
            src={highlight.imageUrl}
            alt={highlight.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-2 bottom-2 rounded-2xl bg-white/75 px-6 py-4 backdrop-blur">
            <h3 className="mb-2 font-roboto text-lg font-medium text-black">
              {highlight.title}
            </h3>
            <p className="text-sm text-black/70">{highlight.description}</p>
          </div>
          <button
            type="button"
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-primary shadow-card transition hover:bg-white"
            aria-label="Reproduzir vídeo em destaque"
          >
            <i className="fas fa-play text-3xl" />
          </button>
        </article>
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((video) => (
            <article
              key={video.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-card"
            >
              <div className="h-32 w-full overflow-hidden rounded-xl">
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h4 className="mb-2 font-roboto text-sm font-medium text-dark line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-dark-75 line-clamp-3">{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export type { VideoPost };
export default LatestVideosSection;

