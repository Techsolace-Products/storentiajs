export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    app_id: string;
    token: string;
    scopes: string[];
    expires_at: string;
    revoked_at: string | null;
    created_at: string;
    updated_at: string;
  };
  timestamp: string;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
}
