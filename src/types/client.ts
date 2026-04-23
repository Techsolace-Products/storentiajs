import { AuthConfig } from './auth';

export interface ClientConfig extends AuthConfig {
  baseUrl?: string;
  timeout?: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}
