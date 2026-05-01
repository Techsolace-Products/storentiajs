import { BaseResource } from './base';
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput, CartItemResponse } from '../types';

export class CartResource extends BaseResource {
  async get(): Promise<Cart> {
    const query = `
      query {
        cart {
          id
          customerId
          items {
            id
            productId
            quantity
            product { id name price }
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
    const mutation = `
      mutation AddToCart($productId: String!, $quantity: Int!) {
        addToCart(input: {
          productId: $productId
          quantity: $quantity
        }) {
          id
          cartId
          quantity
          product { id name }
        }
      }
    `;
    return this._graphql<{ addToCart: CartItemResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.addToCart);
  }

  async updateItem(input: UpdateCartItemInput): Promise<CartItem> {
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
    const mutation = `
      mutation {
        clearCart
      }
    `;
    return this._graphql<{ clearCart: boolean }>(mutation).then((res) => res.clearCart);
  }
}
