export enum OrderStatus {
  PENDING = 'PENDING',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
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
    title: string;
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

/**
 * Everything the browser needs to open the store's payment gateway. All of it
 * is publishable — the merchant's secret key never leaves the platform.
 */
export interface Checkout {
  provider: string;
  appId: string;
  gatewayOrderId: string;
  publicKey: string;
  amountMinor: number;
  currency: string;
  /** "test" or "live", matching the credentials the merchant configured. */
  mode: string;
}

/** Whether this store can take money at all. */
export interface PaymentCapability {
  available: boolean;
  reason?: string;
}

/**
 * A gateway callback as reported by the browser (e.g. Razorpay's `handler`
 * response). Every field is re-verified server side against the merchant's
 * secret before the order moves — none of it is trusted on arrival.
 */
export interface ConfirmPaymentInput {
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  signature: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order;
  /** Present when the order still needs payment; null once it doesn't. */
  checkout: Checkout | null;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  order: Order | null;
}

/**
 * Result of settling an order by asking the gateway directly, for gateways
 * (e.g. Cashfree) whose browser SDK hands back no signed callback to verify.
 */
export type SyncPaymentResponse = ConfirmPaymentResponse;

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


/** Matches the server-side `PaginationInput` (page/limit, 1-indexed). */
export interface OrderPagination {
  page?: number;
  limit?: number;
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
