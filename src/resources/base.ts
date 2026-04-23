import { ApiClient } from '../core/api-client';
import { RequestOptions } from '../types';

export abstract class BaseResource {
  constructor(protected client: ApiClient) {}

  protected async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('GET', endpoint, undefined, options);
  }

  protected async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('POST', endpoint, data, options);
  }

  protected async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('PUT', endpoint, data, options);
  }

  protected async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.client.request<T>('DELETE', endpoint, undefined, options);
  }
}
