import { ClientConfig, RequestOptions, ApiError, AuthResponse } from '../types';

export class ApiClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl;
  private timeout: number;
  private accessToken: string | null = null;

  constructor(config: ClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = 'https://apis.storentia.com/v1';
    this.timeout = config.timeout || 30000;
  }

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
    return authData;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    if (!this.accessToken && !endpoint.includes('/auth/oauth/token')) {
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
}
