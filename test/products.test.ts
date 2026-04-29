
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductResource } from '../src/resources/products';
import { ApiClient } from '../src/core/api-client';

describe('ProductResource', () => {
  let apiClient: ApiClient;
  let products: ProductResource;

  beforeEach(() => {
    apiClient = {
      request: vi.fn(),
      graphql: vi.fn(),
    } as any;
    products = new ProductResource(apiClient);
  });

  it('should fetch a product by id', async () => {
    const mockProduct = { id: 'prod-1', title: 'Test Product' };
    (apiClient.graphql as any).mockResolvedValueOnce({ product: mockProduct });

    const result = await products.get('prod-1');

    const calls = (apiClient.graphql as any).mock.calls;
    expect(calls[0][0]).toMatch(/query GetProduct/);
    expect(calls[0][1]).toEqual({ id: 'prod-1' });
    expect(result).toEqual(mockProduct);
  });

  it('should list products', async () => {
    const mockList = {
      data: [{ id: 'prod-1', title: 'Product 1' }],
      pageInfo: { total: 1, hasNextPage: false, totalPages: 1 },
    };
    (apiClient.graphql as any).mockResolvedValueOnce({ listProducts: mockList });

    const result = await products.list({ status: 'ACTIVE' as any });

    const calls = (apiClient.graphql as any).mock.calls;
    expect(calls[0][0]).toMatch(/query ListProducts/);
    expect(calls[0][1]).toEqual({ status: 'ACTIVE' });
    expect(result).toEqual(mockList);
  });

  it('should create a product', async () => {
    const input = { title: 'New Product' };
    const mockCreated = { id: 'new-id', ...input };
    (apiClient.graphql as any).mockResolvedValueOnce({ createProduct: mockCreated });

    const result = await products.create(input as any);

    const calls = (apiClient.graphql as any).mock.calls;
    expect(calls[0][0]).toMatch(/mutation CreateProduct/);
    expect(calls[0][1]).toEqual({ input });
    expect(result).toEqual(mockCreated);
  });

  it('should delete a product', async () => {
    (apiClient.graphql as any).mockResolvedValueOnce({ deleteProduct: true });

    const result = await products.delete('prod-1');

    const calls = (apiClient.graphql as any).mock.calls;
    expect(calls[0][0]).toMatch(/mutation DeleteProduct/);
    expect(calls[0][1]).toEqual({ id: 'prod-1' });
    expect(result).toBe(true);
  });
});
