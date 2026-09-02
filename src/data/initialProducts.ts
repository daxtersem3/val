import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos os Produtos', slug: 'todos' },
  { id: 'promocao', name: '🔥 Ofertas & Promoções', slug: 'promocao' },
  { id: 'camisetas', name: 'Camisetas & Grifes', slug: 'camisetas' },
  { id: 'tenis', name: 'Tênis Importados', slug: 'tenis' },
  { id: 'conjuntos', name: 'Conjuntos & Agasalhos', slug: 'conjuntos' },
  { id: 'perfumes', name: 'Perfumes Importados', slug: 'perfumes' },
  { id: 'acessorios', name: 'Bonés & Acessórios', slug: 'acessorios' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Camiseta Nike Tech Oversized Black Gold',
    category: 'camisetas',
    price: 189.90,
    originalPrice: 249.90,
    discountPercent: 24,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camiseta 100% Algodão Pima Importado, caimento oversized perfeito, estampa em relevo dourado de alta durabilidade.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto/Dourado', 'Branco/Dourado'],
    featured: true,
    badge: 'BEST-SELLER',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Tênis Air Jordan 1 High OG Yellow Toe',
    category: 'tenis',
    price: 749.00,
    originalPrice: 899.00,
    discountPercent: 17,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    imageSubclasses: {
      0: 'Amarelo',
      1: 'Preto',
      2: 'Vermelho'
    },
    colorSizes: {
      'Amarelo': ['39', '40', '41', '42'],
      'Preto': ['40', '41', '42', '43'],
      'Vermelho': ['38', '43']
    },
    description: 'Tênis em couro legítimo premium, combinação icônica de cores exclusivas. Acompanha cadarços extras e caixa original.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Amarelo/Preto'],
    featured: true,
    badge: 'EXCLUSIVO',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Conjunto Moletom Trapstar London Black Edition',
    category: 'conjuntos',
    price: 459.90,
    originalPrice: 580.00,
    discountPercent: 20,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Conjunto completo de Blusa de Frio + Calça Jogger. Bordado em alta definição, flanelado interno macio e aquecido.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto/Branco'],
    featured: true,
    badge: 'NOVO',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Perfume Sauvage Elixir 100ml Importado',
    category: 'perfumes',
    price: 399.00,
    originalPrice: 499.00,
    discountPercent: 20,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea081ae7aae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Fragrância concentrada marcante com notas amadeiradas e especiarias. Fixação de mais de 14 horas na pele.',
    sizes: ['100ml'],
    featured: true,
    badge: 'BEST-SELLER',
    inStock: true
  },
  {
    id: 'prod-5',
    name: 'Boné New Era 59FIFTY NY Black & Gold',
    category: 'acessorios',
    price: 139.90,
    originalPrice: 179.90,
    discountPercent: 22,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Boné aba reta estruturado com bordado metálico em fios de ouro. Selo holofote de autenticidade.',
    sizes: ['Ajustável', '7 1/4', '7 3/8', '7 1/2'],
    colors: ['Preto Dourado'],
    featured: false,
    badge: 'NOVO',
    inStock: true
  },
  {
    id: 'prod-6',
    name: 'Camiseta Balenciaga Graphic Vintage Edition',
    category: 'camisetas',
    price: 219.90,
    originalPrice: 280.00,
    discountPercent: 21,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Algodão pesado premium estilo streetwear vintage, lavação especial e corte street confortável.',
    sizes: ['M', 'G', 'GG'],
    colors: ['Cinza Chumbo', 'Preto Stoned'],
    featured: true,
    badge: 'PROMOÇÃO',
    inStock: true
  },
  {
    id: 'prod-7',
    name: 'Tênis Yeezy Boost 350 V2 Onyx',
    category: 'tenis',
    price: 689.90,
    originalPrice: 820.00,
    discountPercent: 16,
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tecnologia Primeknit respirável e amortecimento Boost original de conforto sem igual.',
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Black Onyx'],
    featured: false,
    badge: 'EXCLUSIVO',
    inStock: true
  },
  {
    id: 'prod-8',
    name: 'Corrente Grumet Banhada a Ouro 18k + Pingente',
    category: 'acessorios',
    price: 199.90,
    originalPrice: 260.00,
    discountPercent: 23,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Corrente masculina 70cm com 10mm de espessura. Banho triplo de ouro 18k com verniz de proteção antialérgico.',
    sizes: ['70cm - 10mm'],
    featured: false,
    badge: 'PROMOÇÃO',
    inStock: true
  }
];
