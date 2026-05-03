export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
  };
}

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  customer?: {
    id: string;
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  totalAmount: number;
  currency: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  order: Order;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}


export interface PaginatedOrders {
  data: Order[];
  pageInfo: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaymentCallbackInput {
  order_id: string;
  payment_status: PaymentStatus;
  transaction_id: string;
  message: string;
}

export interface PaymentCallbackResponse {
  success: boolean;
  message: string;
}
