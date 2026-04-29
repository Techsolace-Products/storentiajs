import { describe, it, expect } from 'vitest';
import { Storentia } from '../src/client';

describe('Storentia Client', () => {
  const config = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
  };

  it('should initialize with correct configuration', () => {
    const sdk = new Storentia(config);
    expect(sdk).toBeDefined();
    expect(sdk.products).toBeDefined();
    expect(sdk.auth).toBeDefined();
    expect(sdk.blogs).toBeDefined();
    expect(sdk.pages).toBeDefined();
    expect(sdk.collections).toBeDefined();
    expect(sdk.media).toBeDefined();
    expect(sdk.contacts).toBeDefined();
    expect(sdk.newsletter).toBeDefined();
    expect(sdk.linksets).toBeDefined();
  });

  it('should allow setting and getting access token', () => {
    const sdk = new Storentia(config);
    const token = 'test-token';
    sdk.setAccessToken(token);
    expect(sdk.getAccessToken()).toBe(token);
  });
});
