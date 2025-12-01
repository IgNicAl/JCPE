import React, { useState } from 'react';
import { Tv, Radio, Newspaper, Globe, MessageCircle, Trophy, Utensils } from 'lucide-react';
import logoImg from '@/assets/logo.svg';



// --- MOCKS E DADOS (Mantidos do original) ---

const NEWS_CATEGORIES = [
  { id: 'pernambuco', label: 'Pernambuco' },
  { id: 'politica', label: 'Política' },
  { id: 'economia', label: 'Economia' },
  { id: 'esportes', label: 'Esportes' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'mundo', label: 'Mundo' },
  { id: 'saude', label: 'Saúde' },
  { id: 'educacao', label: 'Educação' },
  { id: 'tecnologia', label: 'Tecnologia' },
];

const CommentsSection = () => (
  <div className="flex flex-col gap-4">
    {[
      { user: 'ellsmartx', text: 'how nice does this look 😍 I feel it should be delicious, thank you' },
      { user: 'cassia', text: "Take a rest, i'll be cheer up you again in 2 next game go go go" },
      { user: 'amanda', text: 'you were stunning today, jan! 💗 great match 👍🏽👍🏽' },
      { user: 'roberto', text: 'Amazing content, keep it up! 👏' },
      { user: 'roberto', text: 'Amazing content, keep it up! 👏' }
    ].map((comment) => (
      <div key={comment.user} className="p-4 bg-neutral-100 rounded-xl">
        <h5 className="font-medium text-stone-700 capitalize">{comment.user}</h5>
        <p className="text-xs text-stone-700/75 capitalize">{comment.text}</p>
      </div>
    ))}
  </div>
);


// --- WIDGET DE MARCAS (Estilo Apple Watch) ---

const brandsData = [
  { id: 'ne10', name: 'NE10 Interior', color: 'bg-blue-500', icon: <Globe size={20} />, labelColor: 'text-blue-500', url: 'https://ne10.uol.com.br/', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/ne10interior.webp' },
  { id: 'radio-jornal', name: 'Rádio Jornal', color: 'bg-red-600', icon: <Radio size={20} />, labelColor: 'text-red-600', url: 'https://radiojornal.ne10.uol.com.br/', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/radio.webp' },
  { id: 'tv-jornal', name: 'TV Jornal', color: 'bg-blue-900', icon: <Tv size={20} />, labelColor: 'text-blue-900', url: 'https://tvjornal.ne10.uol.com.br/', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/tvjornal.webp' },
  { id: 'jc', name: 'JC PE', color: 'bg-red-800', icon: <Newspaper size={20} />, labelColor: 'text-red-800', url: 'https://jcpe.online/', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/jc-novo.webp' },
  { id: 'torcedor', name: 'Blog Torcedor', color: 'bg-green-600', icon: <Trophy size={20} />, labelColor: 'text-green-600', url: 'https://jc.ne10.uol.com.br/blogs/torcedor/', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/blog_do_torcedor.webp' },
  { id: 'social1', name: 'Social 1', color: 'bg-pink-600', icon: <MessageCircle size={20} />, labelColor: 'text-pink-600', url: 'https://social1.ne10.uol.com.br/', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/social.webp' },
  { id: 'receita', name: 'Receita Boa', color: 'bg-orange-500', icon: <Utensils size={20} />, labelColor: 'text-orange-500', url: 'https://tvjornal.ne10.uol.com.br/programas/sabor-da-gente/receita-boa', image: 'https://sjcc.ne10.uol.com.br/rodape_global/img/receita_da_boa.webp' },
];

const BrandFooterWidget = () => {
  const [activeId, setActiveId] = useState('tv-jornal');
  const [isAnimating, setIsAnimating] = useState(false);

  const activeBrand = brandsData.find(b => b.id === activeId) || brandsData[0];
  const surroundingBrands = brandsData.filter(b => b.id !== activeId);

  const handleSelect = (brand: typeof brandsData[0]) => {
    if (brand.id === activeId) {
      if (brand.url) window.open(brand.url, '_blank');
      return;
    }
    setIsAnimating(true);
    setActiveId(brand.id);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
       <div className="inline-flex justify-center items-center gap-1.5 mb-2">
          <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
          <h4 className="text-stone-700 text-lg font-medium font-['Roboto'] capitalize">Nossas Marcas</h4>
        </div>

      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-stone-200 opacity-50 scale-75 animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-stone-200 opacity-30" />

        {brandsData.map((brand) => {
          const isActive = brand.id === activeId;
          let style: React.CSSProperties = {};

          if (isActive) {
            style = {
              transform: 'translate(0, 0) scale(1.1)',
              zIndex: 20,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            };
          } else {
            const index = surroundingBrands.findIndex(b => b.id === brand.id);
            const angle = index * 60;
            const radius = 80;
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            style = {
              transform: `translate(${x}px, ${y}px) scale(0.8)`,
              zIndex: 10,
              opacity: 0.8
            };
          }

          return (
            <button
              key={brand.id}
              onClick={() => handleSelect(brand)}
              className={`
                absolute top-1/2 left-1/2 -ml-7 -mt-7
                w-14 h-14 rounded-full
                flex flex-col items-center justify-center
                transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                cursor-pointer border-[3px] border-neutral-100
                ${brand.image ? 'bg-white' : brand.color} text-white shadow-sm
                group hover:brightness-110 overflow-hidden
              `}
              style={style}
              aria-label={`Selecionar ${brand.name}`}
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300 w-full h-full flex items-center justify-center">
                {brand.image ? (
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                  brand.icon
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-0 text-center h-6 transition-all duration-300">
        <p className={`text-xs font-bold ${activeBrand.labelColor} uppercase tracking-wide`}>
          {activeBrand.name}
        </p>
      </div>
    </div>
  );
};


// --- COMPONENTE FOOTER PRINCIPAL ---

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row justify-center items-start gap-6 p-4 md:p-10 mt-20">

      {/* BLOCO BRANCO PRINCIPAL (Institucional + Categorias + Marcas) */}
      <div className="w-full lg:w-auto xl:w-[948px] h-auto relative bg-neutral-100 rounded-[50px] p-8 pb-20 flex flex-col md:flex-row gap-6">

        {/* COLUNA 1: Logo e Texto (Expansível) */}
        <div className="flex-1 flex flex-col gap-6 min-w-[250px]">
          <div className="flex flex-col gap-4">
            <img src={logoImg} alt="JCPE Logo" className="h-10 w-auto self-start" />
          </div>
          <div className="flex flex-col gap-3 w-full text-justify text-stone-700/75 text-sm font-normal font-['Roboto'] leading-5 tracking-tight">
            <p>
              O Portal JC PE é o novo ecossistema digital do Sistema Jornal do Commercio de Comunicação (SJCC), que integra, em um só lugar, os conteúdos do Jornal do Commercio, da Rádio Jornal e da TV Jornal, além de marcas como Blog do Torcedor, Social1 e Receita da Boa.
            </p>
            <p>
              Com mais de 60 milhões de visitas mensais, o portal entrega informação com credibilidade, profundidade e conexão com a vida dos pernambucanos — seja em texto, vídeo, foto ou áudio.
            </p>
            <p>
              Aqui, você acompanha as principais notícias de Pernambuco e do mundo, com foco em jornalismo de qualidade, entretenimento, esportes e opinião. Tudo com curadoria editorial especializada, personalização baseada em dados e tecnologia feita 100% em casa.
            </p>
            <p>
              O Portal JC PE é mais que um site: é o reflexo da força de marcas históricas que evoluem juntas para continuar sendo líderes em relevância, confiança e inovação.
            </p>
          </div>
        </div>

        {/* CONTAINER DIREITO (Categorias + Widget agrupados para ficarem próximos) */}
        <div className="flex flex-col sm:flex-row gap-8 w-auto">

          {/* COLUNA 2: Categorias e Redes */}
          <div className="w-auto flex flex-col gap-6 md:pl-4 border-l border-stone-200/0 md:border-stone-200/50">
            <div className="flex flex-col gap-2">
              <div className="inline-flex justify-start items-center gap-1.5">
                <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
                <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">Categorias</h4>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 mt-1">
                {NEWS_CATEGORIES.map((cat) => (
                  <a key={cat.id} href={`/categoria/${cat.id}`} className="text-stone-700 text-xs font-normal font-['Roboto'] capitalize hover:text-rose-600 transition-colors">
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="inline-flex justify-start items-center gap-1.5">
                <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
                <h4 className="text-stone-700 text-base font-medium font-['Roboto'] capitalize">Redes Sociais</h4>
              </div>
              <div className="flex flex-wrap gap-2 w-32">
                <button onClick={() => window.open('https://www.facebook.com/jornaldocommercioPE/')} aria-label="Facebook" className="size-8 bg-blue-600 rounded-lg text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-facebook-f text-sm"></i></button>
                <button onClick={() => window.open('https://www.instagram.com/jc_pe/')} aria-label="Instagram" className="size-8 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-lg text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-instagram text-sm"></i></button>
                <button onClick={() => window.open('https://twitter.com/jc_pe/')} aria-label="X" className="size-8 bg-black rounded-lg text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-x-twitter text-sm"></i></button>
                <button onClick={() => window.open('https://www.linkedin.com/company/sistema-jornal-do-commercio/')} aria-label="LinkedIn" className="size-8 bg-[#0077b5] rounded-lg text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-linkedin-in text-sm"></i></button>
                <button onClick={() => window.open('https://www.youtube.com/@JCPlayOficial/')} aria-label="YouTube" className="size-8 bg-red-600 rounded-lg text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-youtube text-sm"></i></button>
                <button onClick={() => window.open('https://www.tiktok.com/@jc_pe/')} aria-label="TikTok" className="size-8 bg-black rounded-lg text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-tiktok text-sm"></i></button>
              </div>
            </div>
          </div>

          {/* COLUNA 3: Widget de Marcas (Próximo das categorias) */}
          <div className="w-auto flex flex-col items-center pt-2 min-w-[240px]">
            <BrandFooterWidget />
          </div>
        </div>

        {/* Rodapé Interno (Copyright) */}
        <div className="absolute left-0 bottom-0 w-full h-12 px-10 py-2 bg-stone-700/5 rounded-b-[50px] flex justify-between items-center">
          <div className="text-stone-700/75 text-xs font-normal font-['Roboto'] capitalize">privacy policy | terms & conditions</div>
          <div className="text-stone-700/75 text-xs font-normal font-['Roboto'] capitalize">all copyright (c) 2024 reserved</div>
        </div>
      </div>


      {/* --- SIDEBARS (Restaurados para estrutura original independente) --- */}

      <div className="w-full lg:w-96 relative">
        <div className="inline-flex justify-start items-center gap-1.5 mb-3">
          <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
          <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">Novos comentários</h4>
        </div>
        <CommentsSection />
      </div>

      <div className="w-full lg:w-96 relative">
        <div className="inline-flex justify-start items-center gap-1.5 mb-3">
          <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
          <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">Nosso Instagram</h4>
        </div>
        <a
          href="https://www.instagram.com/jc_pe/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-[2px] hover:scale-[1.02] transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center gap-4 p-8">
              <i className="fab fa-instagram text-6xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent" />
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-800 mb-1">@jc_pe</p>
                <p className="text-sm text-stone-600">Siga-nos no Instagram</p>
              </div>
              <div className="px-6 py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-full text-white text-sm font-medium">
                Seguir →
              </div>
            </div>
          </div>
        </a>
      </div>

    </footer>
  );
};

export default Footer;
