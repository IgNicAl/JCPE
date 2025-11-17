import React from 'react';

// NOTA: Os imports originais foram substituídos por mocks (dados e componentes
// fictícios) abaixo para permitir a compilação e visualização.
// No seu projeto real, você deve remover esses mocks e usar seus imports
// originais, já que seu ambiente de projeto consegue resolvê-los.

// Mock data for NEWS_CATEGORIES (substituindo '@/utils/constants')
const NEWS_CATEGORIES = [
  { id: 'culture', label: 'Culture' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'featured', label: 'Featured' },
  { id: 'food', label: 'Food' },
  { id: 'healthy-living', label: 'Healthy Living' },
  { id: 'technology', label: 'Technology' },
];

// Mock asset for logoImg (substituindo '@/assets/logo.svg')
const logoImg = "https://placehold.co/160x40/eeeeee/333333?text=JCPE+Logo";

// Mock component for NewsletterSection (substituindo '@/components/molecules/NewsletterSection')
const NewsletterSection = () => (
  <div className="p-4 bg-white rounded-xl shadow-inner mt-2">
    <input type="email" placeholder="Write your email .." className="w-full p-2 border-none rounded-lg text-sm text-stone-700/75" />
    {/* Este é um placeholder, o design do prompt original tinha um campo diferente */}
  </div>
);

// Mock component for CommentsSection (substituindo '@/components/molecules/CommentsSection')
const CommentsSection = () => (
  <div className="flex flex-col gap-4">
    {[
      { user: 'ellsmartx', text: 'how nice does this look 😍 I feel it should be delicious, thank you' },
      { user: 'cassia', text: "Take a rest, i'll be cheer up you again in 2 next game go go go" },
      { user: 'amanda', text: 'you were stunning today, jan! 💗 great match 👍🏽👍🏽' }
    ].map((comment) => (
      <div key={comment.user} className="p-4 bg-neutral-100 rounded-xl">
        <h5 className="font-medium text-stone-700 capitalize">{comment.user}</h5>
        <p className="text-xs text-stone-700/75 capitalize">{comment.text}</p>
      </div>
    ))}
  </div>
);

// Mock component for InstagramGrid (substituindo '@/components/molecules/InstagramGrid')
const InstagramGrid = () => (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(9)].map((_, i) => (
      <img key={i} src={`https://placehold.co/104x104`} alt="insta-placeholder" className="rounded-xl w-full h-auto aspect-square" />
    ))}
  </div>
);


// NOTA: Este componente agora espera que o Tailwind CSS esteja configurado no projeto.
// Ele também espera que as fontes 'Roboto' e 'Font Awesome 6 Brands' (para os ícones)
// estejam sendo carregadas globalmente.

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row justify-center items-start gap-6 p-4 md:p-10 mt-20">

      {/* Container 1: Coluna Esquerda (Logo, Newsletter, Categorias, Social) */}
      <div className="w-full lg:w-auto xl:w-[948px] h-auto relative bg-neutral-100 rounded-tr-[50px] rounded-br-[50px] p-10 pb-20 flex flex-col md:flex-row gap-10">

        {/* Coluna 1.1: Logo, Descrição e Newsletter */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Seção "Mega News" (Logo e Título) */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex justify-start items-center gap-1.5">
              <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
              <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">JCPE</h4>
            </div>
            <img src={logoImg} alt="JCPE Logo" className="h-10 w-auto self-start" />
          </div>

          {/* Descrição */}
          <p className="w-full md:w-80 text-justify text-stone-700/75 text-sm font-normal font-['Roboto'] capitalize leading-5 tracking-tight">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin
          </p>

          {/* Seção Newsletter */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex justify-start items-center gap-1.5">
              <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
              <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">Newsletters</h4>
            </div>
            {/* Usando seu componente de Newsletter. Estilos internos dele serão aplicados. */}
            <NewsletterSection />
          </div>
        </div>

        {/* Coluna 1.2: Categorias e Redes Sociais */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Seção Categorias */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex justify-start items-center gap-1.5">
              <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
              <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">Categories</h4>
            </div>
            <div className="flex flex-col justify-start items-start gap-3.5 mt-2">
              {NEWS_CATEGORIES.map((cat) => (
                <a key={cat.id} href={`/categoria/${cat.id}`} className="text-stone-700 text-xs font-normal font-['Roboto'] capitalize hover:text-rose-600 transition-colors">
                  {cat.label}
                </a>
              ))}
            </div>
          </div>

          {/* Seção Redes Sociais */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex justify-start items-center gap-1.5">
              <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
              <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">social network</h4>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {/* Botão Instagram (do design de destino) */}
              <button className="pl-4 pr-6 py-2.5 bg-gradient-to-r from-pink-500 to-red-400 rounded-xl inline-flex justify-start items-center gap-2 text-white text-sm font-medium font-['Roboto'] capitalize leading-5 hover:opacity-90 transition-opacity">
                <i className="fab fa-instagram size-3.5 text-center" />
                <span>instagram</span>
              </button>
              {/* Botão Twitter (do design de destino) */}
              <button className="size-10 bg-gradient-to-r from-sky-500 to-sky-300 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                <i className="fab fa-twitter size-4 text-center text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright (posicionado absolutamente no rodapé esquerdo) */}
        <div className="absolute left-0 bottom-0 w-full max-w-[908px] h-12 pl-10 sm:pl-52 pr-3 py-2 bg-stone-700/5 rounded-tr-xl rounded-br-xl inline-flex flex-wrap justify-start items-center gap-4">
          <div className="flex-1 text-stone-700/75 text-xs font-normal font-['Roboto'] capitalize">privacy policy | terms & conditions</div>
          <div className="w-auto sm:w-44 text-stone-700/75 text-xs font-normal font-['Roboto'] capitalize">all copyright (c) 2022 reserved</div>
        </div>
      </div>

      {/* Container 2: Novos Comentários */}
      <div className="w-full lg:w-96 relative">
        <div className="inline-flex justify-start items-center gap-1.5 mb-3">
          <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
          <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">new Comments</h4>
        </div>
        {/* Usando seu componente de Comentários */}
        <div className="mt-[43px]">
          <CommentsSection />
        </div>
      </div>

      {/* Container 3: Instagram */}
      <div className="w-full lg:w-96 relative">
        <div className="inline-flex justify-start items-center gap-1.5 mb-3">
          <div className="w-1 h-2.5 bg-rose-600 rounded-xl" />
          <h4 className="text-stone-700 text-xl font-medium font-['Roboto'] capitalize">Follow on Instagram</h4>
        </div>
        {/* Usando seu componente de Grid do Instagram */}
        <div className="mt-[43px]">
          <InstagramGrid />
        </div>
      </div>

      {/* O Copyright foi movido para dentro do "left-footer" para seguir o design de destino. */}
      {/* O <div className={styles.footerBottom}> original foi removido. */}
    </footer>
  );
};

export default Footer;
