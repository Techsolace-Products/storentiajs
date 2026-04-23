import { ApiClient } from './core/api-client';
import { AuthResource } from './resources/auth';
import { ClientConfig } from './types';

export class Storentia {
  private client: ApiClient;
  
  public auth: AuthResource;

  constructor(config: ClientConfig) {
    this.client = new ApiClient(config);
    
    // Initialize resources
    this.auth = new AuthResource(this.client);
  }

  /**
   * Set a manual access token (e.g., from an environment variable)
   */
  setAccessToken(token: string): void {
    this.client.setAccessToken(token);
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.client.getAccessToken();
  }
}
