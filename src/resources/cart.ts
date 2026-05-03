import { BaseResource } from './base';
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput, CartItemResponse } from '../types';

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    name
    sellingPrice
    originalPrice
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
      query {
        cart {
          id
          customerId
          items {
            id
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
      ${PRODUCT_FIELDS}
      mutation AddToCart($productId: String!, $quantity: Int!) {
        addToCart(input: {
          productId: $productId
          quantity: $quantity
        }) {
          id
          cartId
          quantity
          product { ...ProductFields }
        }
      }
    `;
    return this._graphql<{ addToCart: CartItemResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.addToCart);
  }

  async updateItem(input: UpdateCartItemInput): Promise<CartItem> {
    this.requireAuth();

    const mutation = `
      mutation UpdateCartItem($cartItemId: String!, $quantity: Int!) {
        updateCartItem(input: {
          cartItemId: $cartItemId
          quantity: $quantity
        }) {
          id
          quantity
        }
      }
    `;
    return this._graphql<{ updateCartItem: CartItem }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.updateCartItem);
  }

  async removeItem(cartItemId: string): Promise<boolean> {
    this.requireAuth();

    const mutation = `
      mutation RemoveFromCart($cartItemId: String!) {
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
      mutation {
        clearCart
      }
    `;
    return this._graphql<{ clearCart: boolean }>(mutation).then((res) => res.clearCart);
  }
}
