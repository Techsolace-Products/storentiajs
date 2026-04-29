import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '../src/core/api-client';

describe('ApiClient', () => {
  const config = {
    clientId: 'test-id',
    clientSecret: 'test-secret',
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should authenticate and store token', async () => {
    const client = new ApiClient(config);
    const mockAuthResponse = {
      data: {
        token: 'mock-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      },
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    });

    const result = await client.authenticate();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/auth/oauth/token'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      })
    );
    expect(result).toEqual(mockAuthResponse);
    expect(client.getAccessToken()).toBe('mock-token');
  });

  it('should handle authentication failure', async () => {
    const client = new ApiClient(config);

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(client.authenticate()).rejects.toThrow('Unauthorized');
  });

  it('should make an authenticated request', async () => {
    const client = new ApiClient(config);
    client.setAccessToken('existing-token');

    const mockResponse = { data: { id: '123' } };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.request('GET', '/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'x-API-Key': 'existing-token',
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
