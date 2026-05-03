import { BaseResource } from './base';
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput, CartItemResponse } from '../types';

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    title
    description
    originalPrice
    sellingPrice
    sku
    stock
    status
    storeId
    media {
      id
      name
      fileKey
      mimeType
      fileSize
      metadata
    }
    collections {
      id
      name
    }
  }
`;

export class CartResource extends BaseResource {
  private requireAuth(): void {
    if (!this.client.isCustomerAuthenticated()) {
      throw new Error('Customer not authenticated. Call authenticate() first.');
    }
  }

  async get(): Promise<Cart> {
    this.requireAuth();

    const query = `
      ${PRODUCT_FIELDS}
      query GetCart {
        cart {
          id
          customerId
          items {
            id
            cartId
            productId
            quantity
            product { ...ProductFields }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ cart: Cart }>(query).then((res) => res.cart);
  }

  async addItem(input: AddToCartInput): Promise<CartItemResponse> {
    this.requireAuth();

    const mutation = `
      mutation AddToCart($input: AddToCartInput!) {
        addToCart(input: $input) {
          id
          cartId
          productId
          quantity
          product {
            id
            title
            originalPrice
            sellingPrice
            media {
              id
              name
              fileKey
            }
          }
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ addToCart: CartItemResponse }>(
      mutation,
      { input }
    ).then((res) => res.addToCart);
  }

  async updateItem(input: UpdateCartItemInput): Promise<CartItem> {
    this.requireAuth();

    const mutation = `
      mutation UpdateCartItem($input: UpdateCartItemInput!) {
        updateCartItem(input: $input) {
          id
          cartId
          productId
          quantity
          product {
            id
            title
            originalPrice
            sellingPrice
          }
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ updateCartItem: CartItem }>(
      mutation,
      { input }
    ).then((res) => res.updateCartItem);
  }

  async removeItem(cartItemId: string): Promise<boolean> {
    this.requireAuth();

    const mutation = `
      mutation RemoveFromCart($cartItemId: ID!) {
        removeFromCart(cartItemId: $cartItemId)
      }
    `;
    return this._graphql<{ removeFromCart: boolean }>(mutation, { cartItemId }).then(
      (res) => res.removeFromCart
    );
  }

  async clear(): Promise<boolean> {
    this.requireAuth();

    const mutation = `
      mutation ClearCart {
        clearCart
      }
    `;
    return this._graphql<{ clearCart: boolean }>(mutation).then((res) => res.clearCart);
  }
}
