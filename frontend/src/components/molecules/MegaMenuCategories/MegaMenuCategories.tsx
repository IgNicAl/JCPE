import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClickOutside } from '@/hooks/useClickOutside';
import pernambucoImg from '@/assets/pernambuco.png';
import politicaImg from '@/assets/politica.png';
import economiaImg from '@/assets/economia.png';
import esportesImg from '@/assets/esportes.png';
import culturaImg from '@/assets/cultura.png';
import mundoImg from '@/assets/mundo.png';
import saudeImg from '@/assets/saude.png';
import educacaoImg from '@/assets/educacao.png';
import tecnologiaImg from '@/assets/tecnologia.png';

interface SubCategory {
  label: string;
  path: string;
}

interface Category {
  title: string;
  subcategories: SubCategory[];
  image: string;
  path?: string;
}

interface MegaMenuCategoriesProps {
  className?: string;
  onItemClick?: () => void;
}

const MegaMenuCategories: React.FC<MegaMenuCategoriesProps> = ({
  className = '',
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuTop, setMenuTop] = useState<number>(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    {
      title: 'Pernambuco',
      image: pernambucoImg,
      path: '/categoria/pernambuco',
      subcategories: [
        { label: 'Região Metropolitana', path: '/pernambuco/metropolitana' },
        { label: 'Segurança Pública', path: '/pernambuco/seguranca' },
        { label: 'Mobilidade', path: '/pernambuco/mobilidade' },
        { label: 'Interior', path: '/pernambuco/interior' },
        { label: 'Educação Estadual', path: '/pernambuco/educacao-estadual' },
        { label: 'Saúde Pública', path: '/pernambuco/saude-publica' },
        { label: 'Turismo Local', path: '/pernambuco/turismo-local' },
      ],
    },
    {
      title: 'Política',
      image: politicaImg,
      path: '/categoria/politica',
      subcategories: [
        { label: 'Governo Federal', path: '/politica/federal' },
        { label: 'Congresso e STF', path: '/politica/congresso-stf' },
        { label: 'Eleições', path: '/politica/eleicoes' },
        { label: 'Bastidores', path: '/politica/bastidores'},
        { label: 'Partidos', path: '/politica/partidos'},
        { label: 'Reforma Tributária', path: '/politica/reforma'},
      ],
    },
    {
      title: 'Economia',
      image: economiaImg,
      path: '/categoria/economia',
      subcategories: [
        { label: 'Negócios', path: '/economia/negocios' },
        { label: 'Finanças Pessoais', path: '/economia/financas' },
        { label: 'Emprego e Concursos', path: '/economia/emprego' },
        { label: 'Agro', path: '/economia/agro' },
        { label: 'Mercado Imobiliário', path: '/economia/imoveis' },
        { label: 'Criptomoedas', path: '/economia/cripto' },
      ],
    },
    {
      title: 'Esportes',
      image: esportesImg,
      path: '/categoria/esportes',
      subcategories: [
        { label: 'Futebol Pernambucano', path: '/esportes/futebol-pe' },
        { label: 'Futebol Nacional', path: '/esportes/futebol-br' },
        { label: 'Futebol Internacional', path: '/esportes/futebol-int' },
        { label: 'Outros Esportes', path: '/esportes/outros-esportes' },
        { label: 'Tabela do Brasileirão', path: '/esportes/tabela-brasileirao' },
      ],
    },
    {
      title: 'Cultura',
      image: culturaImg,
      path: '/categoria/cultura',
      subcategories: [
        { label: 'Música', path: '/cultura/musica' },
        { label: 'Cinema', path: '/cultura/cinema' },
        { label: 'Teatro', path: '/cultura/teatro' },
        { label: 'Literatura', path: '/cultura/literatura' },
        { label: 'Artes Plásticas', path: '/cultura/artes-plasticas' },
        { label: 'Agenda Cultural', path: '/cultura/agenda-cultural' },
      ],
    },
    {
      title: 'Mundo',
      image: mundoImg,
      path: '/categoria/mundo',
      subcategories: [
        { label: 'Américas', path: '/categoria/mundo/americas' },
        { label: 'Europa', path: '/categoria/mundo/europa' },
        { label: 'Ásia e Oceania', path: '/categoria/mundo/asia-oceania' },
        { label: 'Oriente Médio', path: '/categoria/mundo/oriente-medio' },
        { label: 'Guerra na Ucrânia', path: '/categoria/mundo/ucrania' },
      ],
    },
    {
      title: 'Saúde',
      image: saudeImg,
      path: '/categoria/saude',
      subcategories: [
        { label: 'Nutrição', path: '/categoria/saude/nutricao' },
        { label: 'Fitness', path: '/categoria/saude/fitness' },
        { label: 'Saúde Mental', path: '/categoria/saude/mental' },
        { label: 'Medicina', path: '/categoria/saude/medicina' },
        { label: 'Bem-Estar', path: '/categoria/saude/bem-estar' },
      ],
    },
    {
      title: 'Educação',
      image: educacaoImg,
      path: '/categoria/educacao',
      subcategories: [
        { label: 'Provas e Gabaritos', path: '/categoria/educacao/provas' },
        { label: 'Dicas de Estudo', path: '/categoria/educacao/dicas' },
        { label: 'Profissões', path: '/categoria/educacao/profissoes' },
        { label: 'Universidades', path: '/categoria/educacao/universidades' },
        { label: 'Enem', path: '/categoria/educacao/enem' },
      ],
    },
    {
      title: 'Tecnologia',
      image: tecnologiaImg,
      subcategories: [
        { label: 'Inovação', path: '/categoria/tecnologia/inovacao' },
        { label: 'Startups', path: '/categoria/tecnologia/startups' },
        { label: 'Games', path: '/categoria/tecnologia/games' },
        { label: 'Ciência', path: '/categoria/tecnologia/ciencia' },
        { label: 'Gadgets', path: '/categoria/tecnologia/gadgets' },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const toggleDropdown = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuTop(rect.bottom + 8); // Add a small gap
    }
    setIsOpen((prev) => !prev);
  };

  // Close on scroll to prevent detachment issues
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onItemClick) onItemClick();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        ref={triggerRef}
        className={`flex items-center gap-2 cursor-pointer py-2 px-4 rounded-full transition-all duration-300 select-none ${
          isOpen
            ? 'bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100'
            : 'hover:bg-gray-50 text-gray-700 hover:text-red-600'
        }`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu de categorias"
      >
        <span className="font-bold text-lg tracking-tight">Categorias</span>
        <i
          className={`fas fa-chevron-down text-sm transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Mega Menu Dropdown */}
      <div
        style={{ top: `${menuTop}px` }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 pt-2 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="w-[95vw] max-w-[1400px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
          {/* Header Decorator */}
          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

          <div className="flex flex-col lg:flex-row h-[80vh] lg:h-[600px]">
            {/* Main Content - Grid of Categories */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="group relative h-32 lg:h-40 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-black/5"
                    onMouseEnter={() => setActiveCategory(category)}
                    onClick={() => setActiveCategory(category)} // For mobile/touch
                  >
                    {/* Background Image */}
                    <img
                      src={category.image}
                      alt={category.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Blur Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 backdrop-blur-[2px] transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                      <h3 className="text-xl lg:text-2xl font-bold text-white tracking-wide drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        {category.title}
                      </h3>
                      <div className="h-0.5 w-0 group-hover:w-12 bg-red-500 mt-2 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Footer Link */}
              <div className="mt-6 pt-4 border-t border-gray-200 lg:hidden text-center">
                <Link
                  to="/todas-categorias"
                  className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 hover:underline"
                  onClick={handleItemClick}
                >
                  Ver todas as categorias
                </Link>
              </div>
            </div>

            {/* Sidebar - Subcategories Scroll (Desktop) */}
            <div className="hidden lg:flex w-80 bg-white border-l border-gray-100 flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Explorar</h4>
                <h2 className="text-2xl font-bold text-gray-800">{activeCategory.title}</h2>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <div className="flex flex-col gap-1">
                  {activeCategory.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      to={sub.path}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 group transition-colors duration-200"
                      onClick={handleItemClick}
                    >
                      <span className="text-gray-600 font-medium group-hover:text-red-700 transition-colors">
                        {sub.label}
                      </span>
                      <i className="fas fa-chevron-right text-xs text-gray-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}

                  {/* View All Link for Category */}
                  <Link
                    to={`/categoria/${activeCategory.title.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 group transition-colors duration-200 mt-2 border-t border-gray-100"
                    onClick={handleItemClick}
                  >
                    <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 uppercase tracking-wide">
                      Ver tudo em {activeCategory.title}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Subcategories Section */}
             <div className="lg:hidden bg-gray-50 border-t border-gray-200 p-4 max-h-60 overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">
                  Subcategorias de {activeCategory.title}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeCategory.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      to={sub.path}
                      className="text-sm text-gray-600 hover:text-red-600 py-1 truncate"
                      onClick={handleItemClick}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Active Indicator Line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
          isOpen ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  );
};

export default MegaMenuCategories;
