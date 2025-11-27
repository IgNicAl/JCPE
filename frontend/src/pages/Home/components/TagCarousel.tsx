import React, { useRef, useState, useEffect } from 'react';
import { tagService, newsService } from '@/services/api';
import { Tag, News } from '@/types';

// Importar imagens das categorias
import culturaImg from '@/assets/cultura.png';
import economiaImg from '@/assets/economia.png';
import educacaoImg from '@/assets/educacao.png';
import esportesImg from '@/assets/esportes.png';
import mundoImg from '@/assets/mundo.png';
import pernambucoImg from '@/assets/pernambuco.png';
import politicaImg from '@/assets/politica.png';
import saudeImg from '@/assets/saude.png';
import tecnologiaImg from '@/assets/tecnologia.png';

export type TagItem = {
  id: string;
  label: string;
  imageUrl: string;
};

// Mapa de imagens de categorias por slug
const CATEGORY_IMAGES: Record<string, string> = {
  cultura: culturaImg,
  economia: economiaImg,
  educacao: educacaoImg,
  esportes: esportesImg,
  mundo: mundoImg,
  pernambuco: pernambucoImg,
  politica: politicaImg,
  saude: saudeImg,
  tecnologia: tecnologiaImg,
};

// Imagem padrão para tags sem categoria
const DEFAULT_IMAGE = pernambucoImg;

type TagCarouselProps = {
  // Sem props necessárias, buscaremos as tags internamente
};

/**
 * Função auxiliar para mapear tags do backend para o formato TagItem
 * Usa a categoria da notícia associada para determinar a imagem de fundo
 */
const mapTagToTagItem = (tag: Tag, tagToCategoryMap: Map<string, string>): TagItem => {
  // Buscar a categoria associada a esta tag no mapa
  const categorySlug = tagToCategoryMap.get(tag.id);

  // Usar imagem da categoria se encontrada, senão usar imagem padrão
  const imageUrl = categorySlug && CATEGORY_IMAGES[categorySlug]
    ? CATEGORY_IMAGES[categorySlug]
    : DEFAULT_IMAGE;

  return {
    id: tag.id,
    label: `#${tag.name}`,
    imageUrl,
  };
};

const scrollContainerClasses =
  'Tags absolute inset-0 flex gap-6 overflow-x-auto px-4 py-3 items-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab';

const tagTextClasses =
  "relative text-center text-white text-base font-medium font-['Roboto'] capitalize [text-shadow:_0px_0px_2px_rgb(0_0_0_/_0.40)]";

// ATUALIZADO: Adicionado suporte a dark mode para os botões
const arrowButtonClasses =
  'absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-white text-stone-700 shadow-lg transition hover:text-blue-600 dark:bg-neutral-800 dark:text-stone-200 dark:hover:text-blue-400 z-10';

const TagCarousel: React.FC<TagCarouselProps> = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(true);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Buscar tags, categorias e notícias do backend
  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        setLoading(true);

        // Buscar tags, categorias e notícias em paralelo
        const [tagsResponse, newsResponse] = await Promise.all([
          tagService.getAll(),
          newsService.getAll(),
        ]);

        const fetchedTags: Tag[] = tagsResponse.data;
        const fetchedNews: News[] = newsResponse.data;

        // Criar um mapa de tag ID -> category slug
        // Para cada tag, encontrar a primeira notícia que a usa e pegar sua categoria
        const tagToCategoryMap = new Map<string, string>();

        fetchedTags.forEach(tag => {
          // Encontrar a primeira notícia que tem esta tag
          const newsWithTag = fetchedNews.find(news =>
            news.tags?.some(newsTag => newsTag.id === tag.id)
          );

          // Se encontrou uma notícia e ela tem categoria, adicionar ao mapa
          if (newsWithTag?.category?.slug) {
            tagToCategoryMap.set(tag.id, newsWithTag.category.slug);
          }
        });

        // Mapear tags para TagItems com imagens baseadas nas categorias das notícias
        const tagItems = fetchedTags.map(tag =>
          mapTagToTagItem(tag, tagToCategoryMap)
        );

        setTags(tagItems);
      } catch (error) {
        console.error('Erro ao buscar tags e notícias:', error);
        // Em caso de erro, usar array vazio ou manter vazio
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTagsAndCategories();
  }, []);

  const handleScrollUpdate = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setCanGoLeft(scrollLeft > 0);
    // Adiciona uma pequena margem de 1px para garantir
    setCanGoRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const step = direction === 'right' ? 220 : -220;
    containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Atualiza o estado dos botões assim que o componente é montado
    const timer = setTimeout(handleScrollUpdate, 50);

    node.addEventListener('scroll', handleScrollUpdate);
    window.addEventListener('resize', handleScrollUpdate);

    const onMouseDown = (e: MouseEvent) => {
      isDownRef.current = true;
      node.style.cursor = 'grabbing';
      node.style.userSelect = 'none';
      startXRef.current = e.pageX - node.offsetLeft;
      scrollLeftRef.current = node.scrollLeft;
    };

    const onMouseLeave = () => {
      isDownRef.current = false;
      node.style.cursor = 'grab';
      node.style.userSelect = 'auto';
    };

    const onMouseUp = () => {
      isDownRef.current = false;
      node.style.cursor = 'grab';
      node.style.userSelect = 'auto';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;
      e.preventDefault();
      const x = e.pageX - node.offsetLeft;
      const walk = (x - startXRef.current) * 1.5;
      node.scrollLeft = scrollLeftRef.current - walk;
    };

    node.addEventListener('mousedown', onMouseDown as EventListener);
    node.addEventListener('mouseleave', onMouseLeave as EventListener);
    node.addEventListener('mouseup', onMouseUp as EventListener);
    node.addEventListener('mousemove', onMouseMove as EventListener);

    // Chama a atualização também quando o número de tags mudar
    handleScrollUpdate();

    return () => {
      clearTimeout(timer);
      node.removeEventListener('scroll', handleScrollUpdate);
      window.removeEventListener('resize', handleScrollUpdate);

      node.removeEventListener('mousedown', onMouseDown as EventListener);
      node.removeEventListener('mouseleave', onMouseLeave as EventListener);
      node.removeEventListener('mouseup', onMouseUp as EventListener);
      node.removeEventListener('mousemove', onMouseMove as EventListener);
    };
  }, [tags.length]);

  // Exibir placeholder enquanto carrega
  if (loading) {
    return (
      <div
        data-layer="top-tags"
        className="TopTags w-full max-w-[1512px] h-16 relative flex items-center justify-center"
      >
        <span className="text-stone-500 dark:text-stone-400">Carregando tags...</span>
      </div>
    );
  }

  // Não renderizar nada se não houver tags
  if (tags.length === 0) {
    return null;
  }

  return (
    <div
      data-layer="top-tags"
      className="TopTags w-full max-w-[1512px] h-16 relative"
    >
      <div
        data-layer="Rectangle 2"
        className="Rectangle2 w-full h-16 left-0 top-0 absolute bg-transparent rounded-xl"
      />

      <div
        ref={containerRef}
        data-layer="tags"
        className={scrollContainerClasses}
        aria-label="Lista de tags"
      >
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            data-layer="Hashtag"
            className="Hashtag w-44 h-12 relative rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center transition hover:-translate-y-0.5"
            aria-label={`Tag ${tag.label}`}
            onDragStart={(e) => e.preventDefault()}
          >
            <img
              src={tag.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-[2.50px]"
              aria-hidden="true"
              onDragStart={(e) => e.preventDefault()}
            />
            <div
              className="w-44 h-12 left-0 top-0 absolute bg-black/20"
              aria-hidden="true"
            />

            <span className={tagTextClasses}>{tag.label}</span>
          </button>
        ))}
      </div>

      {canGoLeft && (
        <div
          id="gradient-left"
          className="pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-white from-50% via-white/40 to-transparent dark:from-neutral-900 dark:via-neutral-900/40 rounded-l-xl z-10"
        />
      )}

      {canGoRight && (
        <div
          id="gradient-right"
          data-layer="background"
          className="pointer-events-none Background w-36 h-16 inset-y-0 right-0 top-0 absolute bg-gradient-to-l from-white from-50% via-white/40 to-transparent dark:from-neutral-900 dark:via-neutral-900/40 rounded-r-xl z-10"
        />
      )}

      {canGoLeft && (
        <button
          id="btn-left"
          type="button"
          onClick={() => handleScroll('left')}
          className={`${arrowButtonClasses} left-3`}
          aria-label="Ver tags anteriores"
        >
          <i className="fa-solid fa-chevron-left text-lg" />
        </button>
      )}

      {canGoRight && (
        <button
          id="btn-right"
          type="button"
          onClick={() => handleScroll('right')}
          className={`${arrowButtonClasses} right-3`}
          aria-label="Ver mais tags"
        >
          <i className="fa-solid fa-chevron-right text-lg" />
        </button>
      )}
    </div>
  );
};

export default TagCarousel;
