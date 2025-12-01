import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- Interfaces ---
// Usada por HeroSlider e Headlines
interface Slide {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

// Usada por Headlines
interface SingleContentItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

// --- Componente SingleContent (Interno) ---

interface SingleContentProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
  className?: string;
}

const SingleContent: React.FC<SingleContentProps> = ({
  title,
  summary,
  imageUrl,
  slug,
  className = '',
}) => {
  return (
    // Largura de 1/4 (25%) da largura total
    <Link to={`/noticia/${slug}`} className={`w-full h-[452px] md:h-[400px] sm:h-[400px] relative overflow-hidden rounded-md block no-underline transition-transform duration-normal hover:-translate-y-1 ${className}`}>
      <div
        className="w-full h-full absolute left-0 top-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` } as React.CSSProperties}
      >
        {/* Usando placeholder como no HTML */}
        {/* Usando placeholder como no HTML */}
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/384x452/34d399/white?text=Artigo')} />
        <div className="w-full h-full absolute left-0 top-0 bg-overlay-dark dark:bg-overlay-dark" />
      </div>
      {/* Container de informações otimizado */}
      <div className="absolute left-2 right-2 bottom-2">
        <div className="bg-white/80 dark:bg-white/80 rounded-lg backdrop-blur-md px-4 py-3 flex flex-col gap-2 shadow-lg">
          {/* Título limitado a 2 linhas com ellipsis */}
          <h2 className="text-black dark:text-black text-xl lg:text-lg sm:text-base font-roboto font-bold m-0 leading-tight line-clamp-2 overflow-hidden">
            {title}
          </h2>
          {/* Sumário limitado a 2 linhas com ellipsis */}
          <p className="text-black/70 dark:text-black/70 text-sm lg:text-xs sm:text-xs font-roboto font-normal leading-relaxed tracking-wide m-0 line-clamp-2 overflow-hidden">
            {summary}
          </p>
        </div>
      </div>
    </Link>
  );
};

// --- Componente HeroSlider (Interno) ---

interface HeroSliderProps {
  slides?: Slide[];
  className?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Why I Stopped Using Multiple Monitor',
    summary: 'A Single Monitor Manifesto — Many developers believe multiple monitors improve productivity. Studies have proven it, right? Well, keep in mind, many of those studies are commissioned from monitor manufacturers like',
    imageUrl: 'https://placehold.co/744x452/f59e0b/white?text=Tecnologia',
    slug: 'multiple-monitor',
  },
];

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = DEFAULT_SLIDES,
  className = '',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`w-full h-[452px] md:h-[400px] sm:h-[350px] relative overflow-hidden rounded-md mb-xl ${className}`}>
      <Link to={`/noticia/${currentSlideData.slug}`} className="block w-full h-full relative no-underline">
        <div
          className="w-full h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url('${currentSlideData.imageUrl}')` }}
        >
          {/* Usando placeholder como no HTML */}
          <img src={currentSlideData.imageUrl} alt={currentSlideData.title} className="w-full h-full object-cover" />
          <div className="w-full h-full absolute inset-0 bg-overlay-dark dark:bg-overlay-dark" />
        </div>
        {/* Container de informações otimizado para o slider */}
        <div className="absolute left-2 right-2 bottom-2">
          <div className="bg-white/80 dark:bg-white/80 rounded-lg backdrop-blur-md px-5 py-4 flex flex-col gap-2 shadow-lg">
            {/* Título com font-bold e text-black */}
            <h2 className="text-black dark:text-black text-2xl md:text-xl sm:text-lg font-roboto font-bold m-0 leading-tight line-clamp-2">
              {currentSlideData.title}
            </h2>
            {/* Sumário com text-black/70 */}
            <p className="text-black/70 dark:text-black/70 text-base md:text-sm sm:text-xs font-roboto font-normal leading-relaxed tracking-wide m-0 line-clamp-2 md:line-clamp-2 sm:line-clamp-1">
              {currentSlideData.summary}
            </p>
          </div>
        </div>
      </Link>
      {slides.length > 1 && (
        <>
          {/* Posição das setas atualizada para top-[206px] como no HTML */}
          <div className="absolute left-[10px] top-[206px] flex justify-between w-[calc(100%-20px)] pointer-events-none z-10">
            <button
              type="button"
              onClick={handlePrevious}
              className={`w-10 h-10 sm:w-9 sm:h-9 relative border-none bg-transparent cursor-pointer p-0 rounded-md flex items-center justify-center pointer-events-auto ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Slide anterior"
              disabled={currentSlide === 0}
            >
              <div className={`w-10 h-10 sm:w-9 sm:h-9 absolute left-0 top-0 rounded-md transition-all duration-normal ${currentSlide === 0 ? 'bg-primary-overlay-light dark:bg-primary-overlay-light' : 'bg-gray-100 dark:bg-gray-100 hover:bg-primary-overlay-light dark:hover:bg-primary-overlay-light'}`} />
              {/* Ícone Font Awesome adicionado como no HTML */}
              <i className={`relative z-10 text-lg text-stone-700 dark:text-stone-700 fa-solid fa-chevron-left ${currentSlide === 0 ? 'text-stone-700/50 dark:text-stone-700/50' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`w-10 h-10 sm:w-9 sm:h-9 relative border-none bg-transparent cursor-pointer p-0 rounded-md flex items-center justify-center pointer-events-auto ${currentSlide === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Próximo slide"
              disabled={currentSlide === slides.length - 1}
            >
              <div className={`w-10 h-10 sm:w-9 sm:h-9 absolute left-0 top-0 rounded-md transition-all duration-normal ${currentSlide === slides.length - 1 ? 'bg-primary-overlay-light dark:bg-primary-overlay-light' : 'bg-gray-100 dark:bg-gray-100 hover:bg-primary-overlay-light dark:hover:bg-primary-overlay-light'}`} />
              {/* Ícone Font Awesome adicionado como no HTML */}
              <i className={`relative z-10 text-lg text-stone-700 dark:text-stone-700 fa-solid fa-chevron-right ${currentSlide === slides.length - 1 ? 'text-stone-700/50 dark:text-stone-700/50' : ''}`} />
            </button>
          </div>

          {/* Posição dos pontos atualizada como no HTML (para desktop) */}
          <div className="absolute left-[633px] top-[421px] flex justify-end items-center gap-[5px] md:hidden sm:hidden z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                className={`w-[10px] h-[10px] rounded-full border-none cursor-pointer p-0 transition-all duration-normal ${index === currentSlide ? 'w-[27px] h-[10px] rounded-[50px] bg-white' : 'bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.8)]'}`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Fallback responsivo para os pontos (original do TSX) */}
          <div className="absolute right-[10px] bottom-[10px] hidden md:flex sm:flex justify-end items-center gap-[5px] z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                className={`w-[10px] h-[10px] rounded-full border-none cursor-pointer p-0 transition-all duration-normal ${index === currentSlide ? 'w-[27px] h-[10px] rounded-[50px] bg-white' : 'bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.8)]'}`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


// --- Componente Principal Headlines (Exportado) ---

interface HeadlinesProps {
  singleContentItems?: SingleContentItem[];
  sliderSlides?: Slide[];
  className?: string;
}

const Headlines: React.FC<HeadlinesProps> = ({
  singleContentItems = [],
  sliderSlides = [],
  className = '',
}) => {
  const firstContent = singleContentItems[0];
  const secondContent = singleContentItems[1];

  return (
    // Layout de grid: cada SingleContent ocupa 1/4 (25%), HeroSlider ocupa 1/2 (50%)
    <div className={`w-full max-w-[1560px] md:max-w-full h-auto relative rounded-md grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_2fr] gap-[24px] mb-xl ${className}`}>
      {firstContent && (
        <SingleContent
          id={firstContent.id}
          title={firstContent.title}
          summary={firstContent.summary}
          imageUrl={firstContent.imageUrl}
          slug={firstContent.slug}
          // Largura de 1/4 (25%) controlada pelo grid
          className="w-full h-[452px] md:h-[400px] sm:h-[400px]"
        />
      )}

      {secondContent && (
        <SingleContent
          id={secondContent.id}
          title={secondContent.title}
          summary={secondContent.summary}
          imageUrl={secondContent.imageUrl}
          slug={secondContent.slug}
          // Largura de 1/4 (25%) controlada pelo grid
          className="w-full h-[452px] md:h-[400px] sm:h-[400px]"
        />
      )}

      {sliderSlides.length > 0 && (
        <HeroSlider
          slides={sliderSlides}
          className="w-full h-[452px] md:h-[400px] sm:h-[400px] flex-1 min-w-0 md:col-span-2 xl:col-span-1"
        />
      )}
    </div>
  );
};

export default Headlines;
