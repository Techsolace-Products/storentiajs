import { UUID, PaginationInput, PageInfo } from './common';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export interface DiscountCode {
  id: UUID;
  storeId: UUID;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount?: number;
  maxPurchaseAmount?: number;
  usageLimit?: number;
  usagePerCustomer?: number;
  currentUsage: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCodeList {
  data: DiscountCode[];
  pageInfo: PageInfo;
}

/** Result of validating a code against a cart total. */
export interface ValidatedDiscount {
  code: DiscountCode;
  /** Amount to subtract from the cart total, already computed by the server. */
  discountAmount: number;
}

export interface ListDiscountCodesParams {
  storeId: UUID;
  pagination?: PaginationInput;
}
