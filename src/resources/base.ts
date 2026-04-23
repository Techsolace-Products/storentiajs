import { ApiClient } from '../core/api-client';
import { RequestOptions } from '../types';

/**
 * Base class for resource classes. Provides helper methods for HTTP and GraphQL requests.
 * @internal
 */
export abstract class BaseResource {
  constructor(protected client: ApiClient) {}

  /**
   * Make a GET request
   * @param endpoint - API endpoint path
   * @param options - Request options
   * @returns Response data
   * @protected
   */
  protected async _get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * Make a POST request
   * @param endpoint - API endpoint path
   * @param data - Request body
   * @param options - Request options
   * @returns Response data
   * @protected
   */
  protected async _post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body
   * @param options - Request options
   * @returns Response data
   * @protected
   */
  protected async _put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('PUT', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint path
   * @param options - Request options
   * @returns Response data
   * @protected
   */
  protected async _delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Execute a GraphQL query or mutation
   * @param query - GraphQL query/mutation string
   * @param variables - GraphQL variables
   * @param options - Request options
   * @returns GraphQL response data
   * @protected
   */
  protected async _graphql<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    return this.client.graphql<T>(query, variables, options);
  }
}
