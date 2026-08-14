import { BaseResource } from './base';
import {
  Order,
  CreateOrderInput,
  CreateOrderResponse,
  UpdateOrderStatusResponse,
  CancelOrderResponse,
  OrderPagination,
  OrderStatus,
  ConfirmPaymentInput,
  ConfirmPaymentResponse,
  PaymentCapability,
} from '../types';

export class OrderResource extends BaseResource {
  private requireAuth(): void {
    if (!this.client.isCustomerAuthenticated()) {
      throw new Error('Customer not authenticated. Call auth.verifyAuthenticationEmail() first.');
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    this.requireAuth();

    const query = `
      query GetOrder($id: UUID!) {
        order(id: $id) {
          id
          customerId
          storeId
          totalAmount
          currency
          status
          paymentStatus
          createdAt
          updatedAt
          items {
            id
            productId
            quantity
            price
            product {
              id
              title
            }
          }
          customer {
            id
            email
            name
          }
        }
      }
    `;

    return this._graphql<{ order: Order }>(query, { id: orderId }).then((res) => res.order);
  }

  /**
   * List orders. The server returns a plain list — there is no pageInfo envelope
   * on this field, so slice with `pagination` and track your own cursor.
   */
  async getOrders(pagination?: OrderPagination, storeId?: string): Promise<Order[]> {
    this.requireAuth();

    const query = `
      query GetOrders($storeId: UUID, $page: Int, $limit: Int) {
        orders(storeId: $storeId, pagination: { page: $page, limit: $limit }) {
          id
          customerId
          totalAmount
          status
          paymentStatus
          createdAt
          items {
            id
            quantity
            price
          }
        }
      }
    `;

    return this._graphql<{ orders: Order[] }>(query, {
      storeId,
      ...pagination,
    } as unknown as Record<string, unknown>).then((res) => res.orders);
  }

  /** List a single customer's orders. Also a plain list — see {@link getOrders}. */
  async getCustomerOrders(
    customerId: string,
    pagination?: OrderPagination,
    storeId?: string
  ): Promise<Order[]> {
    this.requireAuth();

    const query = `
      query GetCustomerOrders($customerId: UUID!, $storeId: UUID, $page: Int, $limit: Int) {
        customerOrders(customerId: $customerId, storeId: $storeId, pagination: { page: $page, limit: $limit }) {
          id
          totalAmount
          currency
          status
          paymentStatus
          createdAt
          items {
            id
            productId
            quantity
            price
          }
        }
      }
    `;

    return this._graphql<{ customerOrders: Order[] }>(query, {
      customerId,
      storeId,
      ...pagination,
    } as unknown as Record<string, unknown>).then((res) => res.customerOrders);
  }

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
    this.requireAuth();

    const mutation = `
      mutation CreateOrder($totalAmount: Float!, $currency: String!, $items: [OrderItemInput!]!) {
        createOrder(input: {
          totalAmount: $totalAmount
          currency: $currency
          items: $items
        }) {
          success
          message
          order {
            id
            totalAmount
            currency
            status
            paymentStatus
            items {
              id
              quantity
              price
            }
          }
          checkout {
            provider
            appId
            gatewayOrderId
            publicKey
            amountMinor
            currency
            mode
          }
        }
      }
    `;

    return this._graphql<{ createOrder: CreateOrderResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.createOrder);
  }

  /**
   * Settle a gateway callback (e.g. Razorpay's `handler` payload) against an
   * order. The server re-verifies the signature with the merchant's secret —
   * this call only reports what the browser saw.
   */
  async confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResponse> {
    this.requireAuth();

    const mutation = `
      mutation ConfirmOrderPayment($input: ConfirmPaymentInput!) {
        confirmOrderPayment(input: $input) {
          success
          message
          order {
            id
            totalAmount
            currency
            status
            paymentStatus
            items {
              id
              quantity
              price
            }
          }
        }
      }
    `;

    return this._graphql<{ confirmOrderPayment: ConfirmPaymentResponse }>(mutation, {
      input,
    }).then((res) => res.confirmOrderPayment);
  }

  /** Check whether a store can take payments before rendering a checkout button. */
  async paymentCapability(storeId: string): Promise<PaymentCapability> {
    const query = `
      query PaymentCapability($storeId: UUID!) {
        paymentCapability(storeId: $storeId) {
          available
          reason
        }
      }
    `;

    return this._graphql<{ paymentCapability: PaymentCapability }>(query, { storeId }).then(
      (res) => res.paymentCapability
    );
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<UpdateOrderStatusResponse> {
    const mutation = `
      mutation UpdateOrderStatus($orderId: UUID!, $status: OrderStatus!) {
        updateOrderStatus(orderId: $orderId, status: $status) {
          success
          message
          order {
            id
            status
            updatedAt
          }
        }
      }
    `;

    return this._graphql<{ updateOrderStatus: UpdateOrderStatusResponse }>(
      mutation,
      { orderId, status }
    ).then((res) => res.updateOrderStatus);
  }

  async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
    this.requireAuth();

    const mutation = `
      mutation CancelOrder($orderId: UUID!) {
        cancelOrder(orderId: $orderId) {
          success
          message
          order {
            id
            status
            updatedAt
          }
        }
      }
    `;

    return this._graphql<{ cancelOrder: CancelOrderResponse }>(
      mutation,
      { orderId }
    ).then((res) => res.cancelOrder);
  }
}
