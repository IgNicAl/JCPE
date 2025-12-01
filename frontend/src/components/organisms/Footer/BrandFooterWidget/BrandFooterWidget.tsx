import React, { useState } from 'react';
import { Tv, Radio, Newspaper, Globe, MessageCircle, Trophy, UtensilsCrossed } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  color: string;
  Icon: React.ElementType;
}

const BRANDS: Brand[] = [
  { id: 'tv-jornal', name: 'TV Jornal', color: 'bg-blue-900', Icon: Tv },
  { id: 'radio-jornal', name: 'Rádio Jornal', color: 'bg-red-600', Icon: Radio },
  { id: 'jc-pe', name: 'JC PE', color: 'bg-red-700', Icon: Newspaper },
  { id: 'ne10', name: 'NE10', color: 'bg-blue-500', Icon: Globe },
  { id: 'social1', name: 'Social1', color: 'bg-pink-600', Icon: MessageCircle },
  { id: 'blog-torcedor', name: 'Blog do Torcedor', color: 'bg-green-600', Icon: Trophy },
  { id: 'receita-boa', name: 'Receita da Boa', color: 'bg-orange-500', Icon: UtensilsCrossed },
];

const BrandFooterWidget: React.FC = () => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBrandClick = (clickedIndex: number) => {
    if (clickedIndex === centerIndex || isAnimating) return;

    setIsAnimating(true);
    setCenterIndex(clickedIndex);

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getOrbitBrands = () => {
    return BRANDS.filter((_, index) => index !== centerIndex);
  };

  const getOrbitPosition = (index: number) => {
    // Distribui 6 itens em um círculo perfeito (360° / 6 = 60°)
    const angle = (index * 60 - 90) * (Math.PI / 180); // -90 para começar no topo
    const radius = 90; // raio do círculo em pixels (ajustado para tamanho médio)

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const centerBrand = BRANDS[centerIndex];
  const orbitBrands = getOrbitBrands();

  return (
    <div className="w-full h-full min-h-[260px] flex items-center justify-center py-4 px-2">
      <div className="relative w-full max-w-[260px]">
        {/* Container do Sistema Planetário */}
        <div className="relative w-full aspect-square max-w-[260px] mx-auto">
          {/* Marca Central */}
          <div
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-24 h-24 rounded-full shadow-2xl
              flex flex-col items-center justify-center gap-1.5
              transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              z-20 cursor-default
              ${centerBrand.color}
            `}
          >
            <centerBrand.Icon className="w-9 h-9 text-white" strokeWidth={2} />
            <span className="text-white text-[10px] font-medium font-['Roboto'] text-center px-2 leading-tight">
              {centerBrand.name}
            </span>
          </div>

          {/* Marcas em Órbita */}
          {orbitBrands.map((brand, index) => {
            const position = getOrbitPosition(index);
            const transformStyle = `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`;

            return (
              <button
                key={brand.id}
                onClick={() => handleBrandClick(BRANDS.indexOf(brand))}
                className={`
                  absolute top-1/2 left-1/2
                  w-14 h-14 rounded-full shadow-xl
                  flex flex-col items-center justify-center gap-0.5
                  transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  hover:scale-110 hover:shadow-2xl
                  focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
                  cursor-pointer z-10
                  ${brand.color}
                `}
                style={{ transform: transformStyle }}
                aria-label={`Selecionar ${brand.name}`}
              >
                <brand.Icon className="w-6 h-6 text-white" strokeWidth={2} />
                <span className="text-white text-[8px] font-medium font-['Roboto'] text-center px-1 leading-tight">
                  {brand.name}
                </span>
              </button>
            );
          })}

          {/* Linhas de Conexão (opcional - cria um visual mais "conectado") */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
            style={{ zIndex: 5 }}
          >
            {orbitBrands.map((_, index) => {
              const pos = getOrbitPosition(index);
              return (
                <line
                  key={index}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${pos.x}px)`}
                  y2={`calc(50% + ${pos.y}px)`}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-stone-400"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BrandFooterWidget;
