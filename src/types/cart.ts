import { UUID } from './common';

export interface CartProduct {
  id: UUID;
  title: string;
  description?: string;
  originalPrice: number;
  sellingPrice: number;
  sku?: string;
  /** Only present on cart.get() — addToCart()'s response doesn't fetch these. */
  stock?: number;
  status?: string;
  storeId?: UUID;
  media?: Array<{
    id: UUID;
    name: string;
    fileKey: string;
    mimeType: string;
    fileSize: number;
    metadata?: unknown;
  }>;
  collections?: Array<{ id: UUID; name: string }>;
}

export interface CartItem {
  id: UUID;
  cartId: UUID;
  productId: UUID;
  quantity: number;
  product?: CartProduct;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: UUID;
  customerId: UUID;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartInput {
  productId: UUID;
  quantity: number;
}

export interface UpdateCartItemInput {
  cartItemId: UUID;
  quantity: number;
}

export interface CartItemResponse {
  id: UUID;
  cartId: UUID;
  quantity: number;
  product?: CartProduct;
}
