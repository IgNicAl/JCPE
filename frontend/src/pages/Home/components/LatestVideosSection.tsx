import { Link } from 'react-router-dom';
import HomeSectionTitle from './HomeSectionTitle';
import ArrowControls from './ArrowControls';

type VideoPost = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
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
        <Link to={`/noticia/${highlight.slug}`} className="relative overflow-hidden rounded-2xl block group">
          <img
            src={highlight.imageUrl}
            alt={highlight.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-2 bottom-2 rounded-2xl bg-white/75 px-6 py-4 backdrop-blur transition-colors group-hover:bg-white/90">
            <h3 className="mb-2 font-roboto text-lg font-medium text-black line-clamp-2">
              {highlight.title}
            </h3>
            <p className="text-sm text-black/70 line-clamp-2">{highlight.description}</p>
          </div>
          <button
            type="button"
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-primary shadow-card transition hover:bg-white hover:scale-110"
            aria-label="Reproduzir vídeo em destaque"
          >
            <i className="fas fa-play text-3xl ml-1" />
          </button>
        </Link>
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((video) => (
            <Link
              key={video.id}
              to={`/noticia/${video.slug}`}
              className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-card transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-32 w-full overflow-hidden rounded-xl relative group">
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-primary">
                        <i className="fas fa-play text-sm ml-0.5" />
                    </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <h4 className="mb-2 font-roboto text-sm font-medium text-dark line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-dark-75 line-clamp-3">{video.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export type { VideoPost };
export default LatestVideosSection;

