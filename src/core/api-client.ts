import { ClientConfig, RequestOptions, ApiError, AuthResponse } from '../types';
import { formatApiError, printError } from './error-formatter';
import { Logger } from './logger';

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
  private apiKeyToken: string | null = null;
  private logger = new Logger('ApiClient');

  /**
   * @param config - Client credentials and configuration
   */
  constructor(config: ClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = 'https://apis.storentia.com';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Obtain an access token using OAuth2 client credentials flow
   * @returns Auth response with access token and expiration
   * @throws ApiError if authentication fails
   */
  async authenticate(): Promise<AuthResponse> {
    const url = `${this.baseUrl}/v1/auth/oauth/token`;
    this.logger.info(`Authenticating at ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`Auth failed: ${response.status}`, errorBody);
      const formatted = formatApiError(response.status, errorBody);
      console.error(printError(formatted));
      throw new ApiError(response.status, formatted.message);
    }

    const authData = (await response.json()) as AuthResponse;
    const expiresAtMs = new Date(authData.data.expires_at).getTime();
    const expiresInSeconds = Math.floor((expiresAtMs - Date.now()) / 1000);

    this.logger.debug(`OAuth token exchange response`, {
      token: authData.data.token.substring(0, 20) + '...',
      expires_in: expiresInSeconds,
    });
    this.accessToken = authData.data.token;
    // Set expiration with a 60-second buffer
    this.tokenExpiresAt = expiresAtMs - 60 * 1000;
    this.logger.success(`Token received | Expires in ${expiresInSeconds}s`);
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
   * Set API key token for x-API-Key header (e.g., for GraphQL endpoints)
   * @param token - API key token string
   */
  setApiKeyToken(token: string): void {
    this.apiKeyToken = token;
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
    if (!this.accessToken) {
      this.logger.warn(`No token set`);
      return true;
    }
    if (this.tokenExpiresAt === null) {
      this.logger.debug(`Manual token (no expiration)`);
      return false; // Manual token
    }
    const expired = Date.now() >= this.tokenExpiresAt;
    const timeLeft = Math.round((this.tokenExpiresAt - Date.now()) / 1000);
    if (expired) {
      this.logger.warn(`Token expired`);
    } else {
      this.logger.debug(`Token valid | TTL: ${timeLeft}s`);
    }
    return expired;
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

    this.logger.info(`${method} ${endpoint}`);

    if (!isAuthRequest && this.isTokenExpired()) {
      this.logger.warn(`Token expired, re-authenticating...`);
      await this.authenticate();
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken.substring(0, 20)}...`;
      this.logger.debug(`Auth header added`);
    } else {
      this.logger.warn(`No auth token available`);
    }

    if (this.apiKeyToken) {
      headers['x-API-Key'] = this.apiKeyToken;
      this.logger.debug(`x-API-Key header added`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout || this.timeout
    );

    try {
      this.logger.debug(`Sending to ${url}`);
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      this.logger.debug(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Error response`, errorBody);
        const formatted = formatApiError(response.status, errorBody);
        console.error(printError(formatted));
        throw new ApiError(response.status, formatted.message);
      }

      const result = (await response.json()) as T;
      this.logger.success(`Request successful`);
      return result;
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
    this.logger.debug(`Query: ${query.substring(0, 50)}...`);
    if (variables) {
      this.logger.debug(`Variables: ${JSON.stringify(variables)}`);
    }

    const res = await this.request<{ data: T; errors?: any[] }>(
      'POST',
      '/graphql',
      { query, variables },
      options
    );

    if (res.errors && res.errors.length > 0) {
      const messages = res.errors.map((e) => e.message).join(', ');
      this.logger.error(`GraphQL error: ${messages}`);
      throw new ApiError(400, messages);
    }

    this.logger.success(`GraphQL query successful`);
    return res.data;
  }
}
