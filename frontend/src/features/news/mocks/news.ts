import { News } from '@/types';

/**
 * Interface estendida para dados mock.
 * No futuro, 'summary', 'slug', etc., devem ser integrados ao tipo 'News' principal
 * ou tratados via serializador de API.
 */
export interface MockNews extends News {
  summary: string;
  slug: string;
  category: string;
  featuredImageUrl: string;
  publicationDate: string;
  priority: number;
  isFeatured?: boolean;
}

// Dados estáticos para desenvolvimento e testes.
// Substituir por 'useNews' quando o endpoint estiver estável.
export const MOCK_NEWS: MockNews[] = [
  {
    id: '1',
    title: 'Pernambuco investe em infraestrutura digital para empresas',
    summary: 'Governo anuncia R$ 100 milhões em investimentos para modernizar a infraestrutura tecnológica do estado.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    slug: 'infraestrutura-digital-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '2',
    title: 'Recife sedia conferência internacional de tecnologia',
    summary: 'Evento reúne empreendedores e investidores de 50 países para discutir inovação e startups.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    slug: 'conferencia-tech-recife',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '3',
    title: 'Economia de Pernambuco cresce 3.2% no trimestre',
    summary: 'Indústria, comércio e serviços apresentam recuperação significativa conforme dados do IBGE.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    slug: 'economia-pe-crescimento',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  {
    id: '4',
    title: 'Nova legislação ambiental entra em vigor em Pernambuco',
    summary: 'Lei visa proteger biomas locais e incentivar empresas a adotarem práticas sustentáveis.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    slug: 'legislacao-ambiental-pe',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '5',
    title: 'Turismo em Recife quebra recorde de visitantes',
    summary: 'Número de turistas internacionais chega a 1 milhão de pessoas em 2025.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    slug: 'turismo-recife-recorde',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
  {
    id: '6',
    title: 'Câmara aprova novo orçamento para educação em PE',
    summary: 'Investimento de R$ 2 bilhões reforça políticas de alfabetização e tecnologia nas escolas.',
    category: 'politica',
    featuredImageUrl: 'https://images.unsplash.com/photo-1427504494785-411a473e9f7f?w=600&h=400&fit=crop',
    slug: 'orcamento-educacao-pe',
    publicationDate: new Date().toISOString(),
    priority: 3
  },
  // Adicionando mais notícias mock para preencher as seções
  {
    id: '7',
    title: 'Novo polo gastronômico em Boa Viagem',
    summary: 'Bairro ganha complexo com restaurantes e bares, gerando 200 empregos diretos.',
    category: 'noticias',
    featuredImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    slug: 'polo-gastronomico-boa-viagem',
    publicationDate: new Date().toISOString(),
    priority: 1
  },
  {
    id: '8',
    title: 'Investimento em startups de IA cresce 50% em PE',
    summary: 'Ecossistema de inovação local atrai fundos de venture capital focados em inteligência artificial.',
    category: 'economia',
    featuredImageUrl: 'https://images.unsplash.com/photo-1516116215651-2ab251101e14?w=600&h=400&fit=crop',
    slug: 'ia-startups-pe',
    publicationDate: new Date().toISOString(),
    priority: 2
  },
];
