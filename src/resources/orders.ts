import { BaseResource } from './base';
import {
  Order,
  CreateOrderInput,
  CreateOrderResponse,
  UpdateOrderStatusResponse,
  CancelOrderResponse,
  PaginatedOrders,
  OrderStatus,
} from '../types';

export class OrderResource extends BaseResource {
  private requireAuth(): void {
    if (!this.client.isCustomerAuthenticated()) {
      throw new Error('Customer not authenticated. Call authenticate() first.');
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    this.requireAuth();

    const query = `
      query GetOrder($id: String!) {
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
              name
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

  async getOrders(pagination?: any): Promise<PaginatedOrders> {
    this.requireAuth();

    const query = `
      query GetOrders($page: Int, $limit: Int) {
        orders(pagination: { page: $page, limit: $limit }) {
          data {
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
          pageInfo {
            page
            limit
            total
            pages
          }
        }
      }
    `;

    return this._graphql<{ orders: PaginatedOrders }>(
      query,
      pagination as unknown as Record<string, unknown>
    ).then((res) => res.orders);
  }

  async getCustomerOrders(customerId: string, pagination?: any): Promise<PaginatedOrders> {
    this.requireAuth();

    const query = `
      query GetCustomerOrders($customerId: String!, $page: Int, $limit: Int) {
        customerOrders(customerId: $customerId, pagination: { page: $page, limit: $limit }) {
          data {
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
          pageInfo {
            page
            limit
            total
            pages
          }
        }
      }
    `;

    return this._graphql<{ customerOrders: PaginatedOrders }>(
      query,
      { customerId, ...pagination } as unknown as Record<string, unknown>
    ).then((res) => res.customerOrders);
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

    return this._graphql<{ createOrder: CreateOrderResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.createOrder);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<UpdateOrderStatusResponse> {
    const mutation = `
      mutation UpdateOrderStatus($orderId: String!, $status: OrderStatus!) {
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
      mutation CancelOrder($orderId: String!) {
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
