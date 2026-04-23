/** Unique identifier type (UUID string) */
export type UUID = string;

/**
 * Input parameters for paginated API requests
 * @example { page: 1, limit: 20 }
 */
export interface PaginationInput {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  limit?: number;
}

/**
 * Pagination metadata in API responses
 */
export interface PageInfo {
  /** Total number of items */
  total: number;
  /** Whether more items are available */
  hasNextPage: boolean;
  /** Total number of pages */
  totalPages?: number;
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T> {
  /** Success status */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error message if request failed */
  error?: string;
}

/**
 * Error thrown by API requests
 * @example
 * ```js
 * try {
 *   await storentia.products.get('invalid-id');
 * } catch (err) {
 *   if (err instanceof ApiError) {
 *     console.log(err.statusCode); // e.g., 404
 *     console.log(err.message);    // e.g., "Product not found"
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
  /**
   * @param statusCode - HTTP status code
   * @param message - Error message
   */
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
