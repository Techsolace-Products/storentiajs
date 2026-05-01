import { UUID } from './common';

export interface CartProduct {
  id: UUID;
  name: string;
  price?: number;
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
