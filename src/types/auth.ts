export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
}
