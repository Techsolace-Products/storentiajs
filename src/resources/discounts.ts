import { BaseResource } from './base';
import {
  DiscountCode,
  DiscountCodeList,
  ListDiscountCodesParams,
  UUID,
  ValidatedDiscount,
} from '../types';

const DISCOUNT_FIELDS = `
  fragment DiscountFields on DiscountCode {
    id
    storeId
    code
    description
    discountType
    discountValue
    minPurchaseAmount
    maxPurchaseAmount
    usageLimit
    usagePerCustomer
    currentUsage
    startDate
    endDate
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Discount code resource.
 *
 * @example
 * ```js
 * const result = await storentia.discounts.validate(storeId, 'WELCOME10', 2499);
 * if (result) applyDiscount(result.discountAmount);
 * ```
 */
export class DiscountResource extends BaseResource {
  /**
   * Validate a code against a cart total.
   * @returns The code with the server-computed discount amount, or null when the
   * code does not exist, has expired, or does not apply to this cart total.
   */
  async validate(
    storeId: UUID,
    code: string,
    cartTotal: number
  ): Promise<ValidatedDiscount | null> {
    const query = `
      ${DISCOUNT_FIELDS}
      query ValidateDiscountCode($storeId: UUID!, $code: String!, $cartTotal: Float!) {
        validateDiscountCode(storeId: $storeId, code: $code, cartTotal: $cartTotal) {
          code { ...DiscountFields }
          discountAmount
        }
      }
    `;
    const res = await this._graphql<{
      validateDiscountCode: ValidatedDiscount | null;
    }>(query, { storeId, code, cartTotal });
    return res.validateDiscountCode;
  }

  /** Fetch a single discount code by id. */
  async get(id: UUID): Promise<DiscountCode | null> {
    const query = `
      ${DISCOUNT_FIELDS}
      query GetDiscountCode($id: UUID!) {
        discountCode(id: $id) { ...DiscountFields }
      }
    `;
    const res = await this._graphql<{ discountCode: DiscountCode | null }>(query, {
      id,
    });
    return res.discountCode;
  }

  /** Look a code up by its human-facing string, e.g. `WELCOME10`. */
  async getByCode(storeId: UUID, code: string): Promise<DiscountCode | null> {
    const query = `
      ${DISCOUNT_FIELDS}
      query GetDiscountCodeByCode($storeId: UUID!, $code: String!) {
        discountCodeByCode(storeId: $storeId, code: $code) { ...DiscountFields }
      }
    `;
    const res = await this._graphql<{ discountCodeByCode: DiscountCode | null }>(
      query,
      { storeId, code }
    );
    return res.discountCodeByCode;
  }

  /** List a store's discount codes. */
  async list(params: ListDiscountCodesParams): Promise<DiscountCodeList> {
    const query = `
      ${DISCOUNT_FIELDS}
      query ListDiscountCodes($storeId: UUID!, $pagination: PaginationInput) {
        listDiscountCodes(storeId: $storeId, pagination: $pagination) {
          data { ...DiscountFields }
          pageInfo { total hasNextPage totalPages }
        }
      }
    `;
    const res = await this._graphql<{ listDiscountCodes: DiscountCodeList }>(
      query,
      params as unknown as Record<string, unknown>
    );
    return res.listDiscountCodes;
  }
}
