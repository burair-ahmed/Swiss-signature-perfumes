export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: 'men' | 'women' | 'unisex' | 'gift-set';
  fragranceFamily: string;
  volume: string[];
  description: string;
  longDescription: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  rating: number;
  reviewCount: number;
  badge?: 'new' | 'bestseller' | 'limited';
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
}
