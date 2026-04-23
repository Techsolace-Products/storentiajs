import { BaseResource } from './base';
import { AuthResponse } from '../types';

export class AuthResource extends BaseResource {
  async getToken(): Promise<AuthResponse> {
    return this.client.authenticate();
  }
}
