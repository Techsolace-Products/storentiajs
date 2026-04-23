import { ClientConfig, RequestOptions, ApiError, AuthResponse } from '../types';

/**
 * Low-level HTTP client for Storentia API. Handles authentication, request signing, and error handling.
 * @internal Use via Storentia class, not directly.
 */
export class ApiClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl;
  private timeout: number;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  /**
   * @param config - Client credentials and configuration
   */
  constructor(config: ClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = 'https://apis.storentia.com/v1';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Obtain an access token using OAuth2 client credentials flow
   * @returns Auth response with access token and expiration
   * @throws ApiError if authentication fails
   */
  async authenticate(): Promise<AuthResponse> {
    const url = `${this.baseUrl}/auth/oauth/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ApiError(response.status, `Authentication failed: ${error}`);
    }

    const authData = (await response.json()) as AuthResponse;
    this.accessToken = authData.access_token;
    // Set expiration with a 60-second buffer
    this.tokenExpiresAt = Date.now() + (authData.expires_in - 60) * 1000;
    return authData;
  }

  /**
   * Set a pre-obtained access token (e.g., from cache or external auth)
   * @param token - Bearer token string
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.tokenExpiresAt = null;
  }

  /**
   * Get the current access token
   * @returns Token string or null if not authenticated
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if the current token has expired
   * @private
   */
  private isTokenExpired(): boolean {
    if (!this.accessToken) return true;
    if (this.tokenExpiresAt === null) return false; // Manual token
    return Date.now() >= this.tokenExpiresAt;
  }

  /**
   * Make an authenticated HTTP request to the Storentia API
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param endpoint - API endpoint path (e.g., '/products')
   * @param data - Request body for POST/PUT operations
   * @param options - Request options (headers, timeout, etc.)
   * @returns Parsed JSON response
   * @throws ApiError if request fails
   */
  async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const isAuthRequest = endpoint.includes('/auth/oauth/token');

    if (!isAuthRequest && this.isTokenExpired()) {
      await this.authenticate();
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout || this.timeout
    );

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new ApiError(response.status, error || response.statusText);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Execute a GraphQL query or mutation
   * @param query - GraphQL query/mutation string
   * @param variables - Variables for the GraphQL operation
   * @param options - Request options (timeout, headers, etc.)
   * @returns GraphQL response data
   * @throws ApiError if query fails or returns GraphQL errors
   */
  async graphql<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    const res = await this.request<{ data: T; errors?: any[] }>(
      'POST',
      '/graphql',
      { query, variables },
      options
    );

    if (res.errors && res.errors.length > 0) {
      throw new ApiError(
        400,
        `GraphQL Error: ${res.errors.map((e) => e.message).join(', ')}`
      );
    }

    return res.data;
  }
}
