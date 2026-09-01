export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  imageSubclasses?: Record<number, string>; // mapa: índice da imagem → nome da cor/subclasse
  description: string;
  sizes: string[];
  colors?: string[];
  featured?: boolean;
  badge?: 'NOVO' | 'BEST-SELLER' | 'PROMOÇÃO' | 'EXCLUSIVO';
  inStock: boolean;
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
}

export interface CustomerOrderDetails {
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  paymentMethod: 'PIX' | 'Cartão de Crédito/Débito' | 'Dinheiro na Entrega';
  notes?: string;
}
